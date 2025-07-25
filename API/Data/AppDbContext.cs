using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class AppDbContext(DbContextOptions options) : DbContext(options)
    {
        //Users is the name of the table
        public DbSet<AppUser> Users { get; set; }
    }
}