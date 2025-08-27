using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data
{
    public class AppDbContext(DbContextOptions options) : DbContext(options)
    {
        //Users is the name of the table
        public DbSet<AppUser> Users { get; set; }

        public DbSet<Member> Members { get; set; }

        public DbSet<Photo> Photos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc));
            // modelBuilder.Entity<Member>()
            //     .Property(m => m.Created)
            //     .HasConversion(dateTimeConverter);
            // modelBuilder.Entity<Member>()
            //     .Property(m => m.LastActive)
            //     .HasConversion(dateTimeConverter);


            foreach(var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var properties = entityType.GetProperties()
                    .Where(p => p.ClrType == typeof(DateTime));
                foreach (var property in properties)
                {
                    property.SetValueConverter(dateTimeConverter);
                }
            }
        }
    }
}