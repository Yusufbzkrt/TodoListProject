using TodoListProject.Server.Models;

namespace TodoList.Models
{
	public class Tasks
	{
		public int TaskId { get; set; }
		public int UserId { get; set; }
		public User? User { get; set; }
		public string? Title { get; set; }
		public string? Description { get; set; }
		public int ReportTypeId { get; set; }
		public ReportType? ReportType { get; set; }
		public DateTime CreatedAt { get; set; }
		public DateTime? FinishDate { get; set; }
		public bool Status { get; set; }

	}
}
