using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AppNeuron.Models;
using System.Data.Entity;
using System.Web.Security;
using AppNeuron.Utils;
using System.Text.RegularExpressions;
using AppNeuron.Utils.Xml;
using AppNeuron.Utils.Xml.Models;

namespace AppNeuron.Controllers
{
    public class HomeController : Controller
    {
        Models.DbContext db = new Models.DbContext();

        XmlNeuronContext dbXml = new XmlNeuronContext();

        public ActionResult Index()
        {
            if (!HttpContext.User.Identity.IsAuthenticated) return View("Login");
            var user = dbXml.Users
                .FirstOrDefault(u => u.Id == int.Parse(HttpContext.User.Identity.Name));

            if(user == null)
                return View("Login");

            //var settings = db.UserSettings.FirstOrDefault(s => s.UserId == user.Id);
            ViewBag.Helper = true; //settings.Helper;
            ViewBag.Speech = true; //settings.Speech;

            return View(new User {Id = user.Id, Sex = user.Sex, MiddleName = user.MiddleName, LastName = user.LastName, FirstName = user.FirstName, BirthDateYear = user.BirthDateYear });
        }

        [HttpGet]
        public ActionResult Game()
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
                return RedirectToAction("Index", "Home");
            return View();
        }

        [HttpGet]
        public ActionResult GetGameData()
        {
            if (!HttpContext.User.Identity.IsAuthenticated)
                return Json(new GameData() { Error = true }, JsonRequestBehavior.AllowGet);

            var countries = db.Countries
                .Include(country => country.cites)
                .ToList();

            var userId = int.Parse(HttpContext.User.Identity.Name);
            var settings = db.UserSettings
                .FirstOrDefault(s => s.UserId == userId);
            if (settings == null)
            {
                settings = new UserSetting { Enlarg = true, Helper = true, Speech = true, UserId = userId };
                db.UserSettings.Add(settings);
                db.SaveChanges();
            }
            var level = db.UserLevels.FirstOrDefault(l => l.UserId == userId);
            //временно
            if (level == null)
            {
                level = new UserLevel { UserId = userId, Level = 3 };
                db.UserLevels.Add(level);
                db.SaveChanges();
            }
            //временно
            if (level.Level < 7) RemoveCities(countries, level.Level);
            return Json(new GameData() { Countries = countries, Enlarg = settings.Enlarg, Helper = settings.Helper, Speech = settings.Speech },
                JsonRequestBehavior.AllowGet);
        }

        //void RemoveCities(List<Country> countries, int level)
        //{
        //    var numbersIn = Enumerable
        //        .Range(0, 7)
        //        .ToList();
        //    while(numbersIn.Count > level)
        //    {
        //        var random = new Random();
        //        var randomNumber = random.Next(0, numbersIn.Count - 1);
        //        numbersIn.RemoveAt(randomNumber);
        //    }
        //    foreach(var country in countries)
        //    {
        //        var citesOut = new List<City>();
        //        var citesIn = country.cites.ToList();
        //        for (var i = 0; i < citesIn.Count; i++)
        //            if (!numbersIn.Contains(i)) continue;
        //            else
        //                citesOut.Add(citesIn[i]);
        //        country.cites = citesOut;
        //    }
        //}

        [HttpPost]
        public ActionResult GetDeviationFromAverage(int seconds, int result, int level)
        {
            var userId = int.Parse(HttpContext.User.Identity.Name);
            var results = db.PatientsResults
                .Where(p => p.UserId == userId && p.Level == level)
                .OrderByDescending(p => p.Date)
                .Take(10);

            /*var resultsAll = db.PatientsResults
                .Where(p => p.Level == level)
                .GroupBy(p => p.UserId)
                .Select(g => g
                .OrderByDescending(p => p.Date)
                .Take(10));*/

            db.PatientsResults.Add(new PatientsResult { Date = DateTime.Now, Level = level, Result = result, Time = seconds, UserId = userId });
            db.SaveChanges();
            var isReload = ChangeLevel(userId, level);

            var response = new ComparisonData();
            response.Percent = result;
            if (results.Count() != 0)
            {
                /*response.Percent = result * 50 / (int)results.Average(r => r.Result);
                if (response.Percent > 100) response.Percent = 100;*/

                var avgTime = results.Average(r => r.Time);
                response.Time = (int) (avgTime / seconds * 50);
                response.Time = response.Time > 100 ? 100 : response.Time;
            }
            /*if (resultsAll.Count() != 0)
            {
                response.OtherPersent = result * 50 / (int)resultsAll
                    .Select(g => g.Average(p => p.Result))
                    .Average(r => r);
                if (response.OtherPersent > 100) response.OtherPersent = 100;

                var avgTime = resultsAll
                    .Select(g => g.Average(p => p.Time))
                    .Average(s => s);
                response.OtherTime = (int)(avgTime / seconds * 50);
                response.OtherTime = response.OtherTime > 100 ? 100 : response.OtherTime;
            }*/
            response.Reload = isReload;
            return Json(response, JsonRequestBehavior.AllowGet);
        }

        bool ChangeLevel(int userId, int curLevel)
        {
            var isReaload = false;
            var results = db.PatientsResults
                .Where(r => r.UserId == userId && r.Level == curLevel)
                .OrderByDescending(r => r.Date)
                .ThenByDescending(r => r.Id)
                .Take(3)
                .ToArray();
            if(results.Count() == 3)
            {
                var minResult = results.Min(r => r.Result);
                var level = db.UserLevels.FirstOrDefault(l => l.UserId == userId);
                if(minResult > 90 && level.Level < 7)
                {
                    level.Level++;
                    db.Entry(level).State = EntityState.Modified;
                    isReaload = true;
                }
                else if(minResult < 30 && level.Level > 3)
                {
                    level.Level--;
                    db.Entry(level).State = EntityState.Modified;
                    isReaload = true;
                }
            }
            db.SaveChanges();
            return isReaload;
        }

        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(Login model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = dbXml.Users.FirstOrDefault(u => u.FirstName == model.FirstName && 
                    u.LastName == model.LastName && 
                    u.MiddleName == model.MiddleName &&
                    u.BirthDateYear == model.BirthDateYear);

                    if (user != null)
                    {
                        FormsAuthentication.SetAuthCookie(user.Id.ToString(), true);
                        return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        ModelState.AddModelError("", "Пользователя с таким логином и паролем нет");
                    }
                }

                return View(model);
            }
            catch(Exception e)
            {
                return Content(e.Message);
            }
        }

        public ActionResult Register()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Register(Register model, string btn)
        {
            if (btn == "Отмена") return RedirectToAction("Login", "Home");

            if (ModelState.IsValid)
            {
                var user = dbXml.Users.FirstOrDefault(u => u.FirstName == model.FirstName && u.LastName == model.LastName && u.MiddleName == model.MiddleName &&
                u.BirthDateYear == model.BirthDateYear);

                if (user == null)
                {
                    user = dbXml.Users.Add(new UserRow {BirthDateYear = model.BirthDateYear, FirstName = model.FirstName, LastName = model.LastName, MiddleName = model.MiddleName, Sex = model.Sex });

                    if (user != null)
                    {
                        FormsAuthentication.SetAuthCookie(user.Id.ToString(), true);
                        //db.UserSettings.Add(new UserSetting { UserId = int.Parse(user.Id) });
                        //db.UserLevels.Add(new UserLevel { UserId = int.Parse(user.Id), Level = 3 });
                        //db.SaveChanges();
                        return RedirectToAction("Index", "Home");
                    }
                }
                else
                {
                    ModelState.AddModelError("", "Пользователь с таким логином уже существует");
                }
            }

            return View(model);
        }
        public ActionResult Logoff()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Login", "Home");
        }

        [HttpPost]
        public JsonResult GetUsersResults(string text)
        {
            IEnumerable<User> usersWithResults = db
                .PatientsResults
                .Select(r => r.User)
                .Distinct();
            var users = SearchUsers(text)
                .Where(u => usersWithResults.Contains(u));
            return Json(users);
        }

        [HttpGet]
        public ActionResult UserRoom()
        {
            if (!HttpContext.User.Identity.IsAuthenticated) return RedirectToAction("Login", "Home");
            var userId = int.Parse(HttpContext.User.Identity.Name);
            var user = db.Users.FirstOrDefault(u => u.Id == userId);
            var doctor = db.Doctors.FirstOrDefault(d => d.UserId == userId);
            ViewBag.isDoctor = doctor != null;
            return View(user);
        }

        [HttpPost]
        public ActionResult UserRoom(User user)
        {
            if (ModelState.IsValid)
            {
                if (!HttpContext.User.Identity.IsAuthenticated) return RedirectToAction("Login", "Home");

                db.Entry(user).State = EntityState.Modified;
                db.SaveChanges();
            }

            return RedirectToAction("UserRoom", "Home");
        }

        [HttpPost]
        public void UpdateSettings(bool helper, bool? speech, bool? enlarg)
        {
            var userId = int.Parse(HttpContext.User.Identity.Name);
            var settings = db.UserSettings
                .FirstOrDefault(s => s.UserId == userId);
            settings.Helper = helper;
            if(speech != null)
            settings.Speech =(bool) speech;
            if(enlarg != null)
                settings.Enlarg =(bool) enlarg;
            db.Entry(settings).State = EntityState.Modified;
            db.SaveChanges();
        }

        [HttpGet]
        public ActionResult AddDoctors()
        {
            if (!HttpContext.User.Identity.IsAuthenticated) return RedirectToAction("Login", "Home");
            var userId = int.Parse(HttpContext.User.Identity.Name);
            if(db.Doctors.FirstOrDefault(d => d.UserId == userId) == null) return RedirectToAction("Login", "Home");

            IQueryable<User> users = db.Users
                .Where(u => !db.Doctors
                .Select(d => d.UserId)
                .Contains(u.Id));
            return View(users);
        }
        [HttpPost]
        public JsonResult GetUsersData(string text)
        {
            var users = SearchUsers(text);
            var doctors = db.Doctors.ToList();
            var usersWithType = users
                .Select(u => Tuple.Create(u, doctors.Any(d => d.UserId == u.Id)));
            return Json(usersWithType.ToList(), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public void SetUsersType(bool isDoctor, int userId)
        {
            if (isDoctor)
            {
                var doctor = db.Doctors.FirstOrDefault(d => d.UserId == userId);
                if (doctor != null)
                    db.Doctors.Remove(doctor);
            }
            else
                db.Doctors.Add(new Doctor { UserId = userId });
            db.SaveChanges();
        }

        IEnumerable<User> SearchUsers(string text)
        {
            text = text.ToLower();
            var words = text.Split(" "[0]);
            IEnumerable<User> users = db.Users;
            var doctors = db.Doctors.ToList();
            return users
                .Where(u => words.All(w => Regex.IsMatch(u.FirstName.ToLower(), w) || Regex.IsMatch(u.LastName.ToLower(), w) || Regex.IsMatch(u.MiddleName.ToLower(), w)
            ))
            .OrderByDescending(u => u.FirstName);
        }
        public JsonResult GetGraphicsData(int userId)
        {
            IEnumerable<PatientsResult> results = db.PatientsResults
                .Where(r => r.UserId == userId);

            results = results
                .GroupBy(r => r.Date.Date)
                .Select(g => g.OrderBy(r => r.Date))
                .Select(g => g.First())
                .OrderBy(r => r.Date);
            var resultsJson = results
                .Select(r => new PatientsResultsJson { Result = r, DateInString = r.Date.ToString("dd.MM.yyyy") });
            return Json(resultsJson.ToList());
        }
        [HttpPost]
        public JsonResult GetUserGraphicData()
        {
            var userId = int.Parse(HttpContext.User.Identity.Name);

            return GetGraphicsData(userId);
        }

        [HttpGet]
        public void Test()
        {
            var context = new XmlNeuronContext();
            //var countries = context.Countries.Where(c => c.Id == "1").ToList();
        }
    }

}