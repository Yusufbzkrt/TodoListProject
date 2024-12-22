namespace TodoList.Models
{
	public class User
	{
		public int UserId { get; set; } 
		public string? Name { get; set; } 
		public string? Surname { get; set; } 
		public string? UserName { get; set; } 
		public string? Passwordhash { get; set; } 
		public string? Email { get; set; } 
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

		public ICollection<Tasks>? Tasks { get; set; }
		public ICollection<Token>? RefreshTokens { get; set; }
	}
}
