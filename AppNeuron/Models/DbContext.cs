﻿using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace AppNeuron.Models
{
    public class DbContext : System.Data.Entity.DbContext
    {
        public DbSet<Country> Countries { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<PatientsResult> PatientsResults { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<UserSetting> UserSettings { get; set; }
        public DbSet<UserLevel> UserLevels { get; set; }

        /*protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<City>()
                .HasKey(ci => ci.id)
                .HasRequired(ci => ci.Country)
                .WithMany(co => co.cites)
                .HasForeignKey(ci => ci.CountryId);
        }*/
    }
}