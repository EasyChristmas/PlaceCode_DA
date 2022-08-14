
//using Domain;
using SDK;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;

namespace Service
{
    public class EFDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var serverVersion = new MySqlServerVersion(new Version(8, 0, 27));
            optionsBuilder.UseMySql(ApiGlobalData.DbConnectionString, serverVersion);
            base.OnConfiguring(optionsBuilder);
        }
    }
}
