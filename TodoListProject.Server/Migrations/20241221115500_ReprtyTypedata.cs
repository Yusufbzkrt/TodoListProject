using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TodoListProject.Server.Migrations
{
    /// <inheritdoc />
    public partial class ReprtyTypedata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ReportTypes",
                columns: new[] { "ReportTypeId", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Günlük raporunuzu buradan tutabilirsiniz.", "daily" },
                    { 2, "Haftalık raporunuzu buradan tutabilirsiniz.", "weekly" },
                    { 3, "Aylık raporunuzu buradan tutabilirsiniz.", "monthly" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ReportTypes",
                keyColumn: "ReportTypeId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ReportTypes",
                keyColumn: "ReportTypeId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ReportTypes",
                keyColumn: "ReportTypeId",
                keyValue: 3);
        }
    }
}
