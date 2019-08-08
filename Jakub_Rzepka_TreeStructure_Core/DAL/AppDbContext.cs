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

            modelBuilder.Entity<Node>().HasData(
              new Node { Id = 1, Name = "Europe", ParentNodeId = null, Index = 1 },
              new Node { Id = 2, Name = "Poland", ParentNodeId = 1, Index = 0 },
              new Node { Id = 3, Name = "Rzeszow", ParentNodeId = 2, Index = 0 },
              new Node { Id = 4, Name = "Warsaw", ParentNodeId = 2, Index = 1 },
              new Node { Id = 5, Name = "Asia", ParentNodeId = null, Index = 2 },
              new Node { Id = 6, Name = "China", ParentNodeId = 5, Index = 0 },
              new Node { Id = 7, Name = "Philippines", ParentNodeId = 5, Index = 1 },
              new Node { Id = 8, Name = "South America", ParentNodeId = null, Index = 3 },
              new Node { Id = 9, Name = "Mexico", ParentNodeId = 8, Index = 0 },
              new Node { Id = 10, Name = "Brazil", ParentNodeId = 8, Index = 1 },
              new Node { Id = 11, Name = "Australia", ParentNodeId = null, Index = 4 }
          );
        }
    }
}
