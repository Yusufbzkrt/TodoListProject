using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TodoListProject.Server.Models;

namespace TodoListProject.Server.Config
{
	public class ReportTypeConfig : IEntityTypeConfiguration<ReportType>
	{
		public void Configure(EntityTypeBuilder<ReportType> builder)
		{
			builder.HasData(
					new ReportType() { ReportTypeId = 1, Name = "daily", Description = "Günlük raporunuzu buradan tutabilirsiniz." },
					new ReportType() { ReportTypeId = 2, Name = "weekly", Description = "Haftalık raporunuzu buradan tutabilirsiniz." },
					new ReportType() { ReportTypeId = 3, Name = "monthly", Description = "Aylık raporunuzu buradan tutabilirsiniz." }
					);
		}
	}

}

