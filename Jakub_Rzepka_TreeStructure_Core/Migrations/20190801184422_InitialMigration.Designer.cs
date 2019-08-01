﻿// <auto-generated />
using System;
using Jakub_Rzepka_TreeStructure_Core.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Jakub_Rzepka_TreeStructure_Core.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20190801184422_InitialMigration")]
    partial class InitialMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Jakub_Rzepka_TreeStructure_Core.Models.Node", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name");

                    b.Property<int?>("ParentNodeId");

                    b.HasKey("Id");

                    b.HasIndex("ParentNodeId");

                    b.ToTable("Nodes");
                });

            modelBuilder.Entity("Jakub_Rzepka_TreeStructure_Core.Models.Node", b =>
                {
                    b.HasOne("Jakub_Rzepka_TreeStructure_Core.Models.Node", "ParentNode")
                        .WithMany("SubNodes")
                        .HasForeignKey("ParentNodeId");
                });
#pragma warning restore 612, 618
        }
    }
}
