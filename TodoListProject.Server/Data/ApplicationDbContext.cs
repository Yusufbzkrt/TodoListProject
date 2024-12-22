using Microsoft.EntityFrameworkCore;
using TodoList.Models;
using TodoListProject.Server.Models;
using TodoListProject.Server.Config;

namespace TodoList.Data
{
	public class ApplicationDbContext : DbContext
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
			: base(options)
		{
		}
		public DbSet<User> Users { get; set; }
		public DbSet<Token> Tokens { get; set; }
		public DbSet<Tasks> Tasks { get; set; }
		public DbSet<ReportType> ReportTypes { get; set; }


		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			ConfigureTaskUserRelationship(modelBuilder);
			ConfigureTaskReportTypeRelationship(modelBuilder);

			modelBuilder.ApplyConfiguration(new ReportTypeConfig());
		}


		private void ConfigureTaskUserRelationship(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Tasks>()
				.HasKey(t => t.TaskId);

			modelBuilder.Entity<Tasks>()
				.HasOne(t => t.User)
				.WithMany(u => u.Tasks)
				.HasForeignKey(t => t.UserId)
				.OnDelete(DeleteBehavior.Cascade);
		}

		private void ConfigureTaskReportTypeRelationship(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<ReportType>()
				.HasKey(rt => rt.ReportTypeId);

			modelBuilder.Entity<ReportType>()
				.HasMany(rt => rt.Tasks)
				 .WithOne(t => t.ReportType)
				  .HasForeignKey(t => t.ReportTypeId);
		}

	}
}