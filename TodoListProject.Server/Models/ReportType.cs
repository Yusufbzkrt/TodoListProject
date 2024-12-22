using TodoList.Models;

namespace TodoListProject.Server.Models
{
	public class ReportType
	{
		public int ReportTypeId { get; set; }
		public string Name { get; set; }
		public string Description { get; set; }
		public ICollection<Tasks> Tasks { get; set; }
	}
}
