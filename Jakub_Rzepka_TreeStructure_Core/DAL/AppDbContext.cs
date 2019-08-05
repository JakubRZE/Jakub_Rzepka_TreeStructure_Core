using Jakub_Rzepka_TreeStructure_Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jakub_Rzepka_TreeStructure_Core.DAL
{
    public class AppDbContext : IdentityDbContext<IdentityUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Node> Nodes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Node>()
            .HasMany(n => n.SubNodes)
            .WithOne(n => n.ParentNode)
            .HasForeignKey(n => n.ParentNodeId);

            //.OnDelete(DeleteBehavior.Cascade);
        }
    }
}
