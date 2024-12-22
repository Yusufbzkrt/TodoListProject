using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TodoList.Data;
using TodoList.Extensions;
using TodoList.Models;

namespace TodoList.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ReportsController : ControllerBase
	{
		private readonly ApplicationDbContext _context;

		public ReportsController(ApplicationDbContext context)
		{
			_context = context;
		}

	/*--------RAPORLARI LİSTELEME----------*/
		[HttpGet("{reportType}")]
		public async Task<ActionResult<IEnumerable<Tasks>>> GetReport(string reportType)
		{
			var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (userIdClaim == null)
			{
				return Unauthorized(new { message = "Kullanıcı bilgileri eksik." });
			}
			var userId = int.Parse(userIdClaim);
			var reports = await _context.Tasks.ToListAsync();

			if (reportType == "daily")
			{
				reports = await _context.Tasks
				.Where(r => r.ReportTypeId == 1 && r.UserId == userId)
				.ToListAsync();


			}
			else if (reportType == "weekly")
			{
				reports = await _context.Tasks
				.Where(r => r.ReportTypeId == 2 && r.UserId == userId)
				.ToListAsync();
			}
			else if (reportType == "monthly")
			{
				reports = await _context.Tasks
				.Where(r => r.ReportTypeId == 3 && r.UserId == userId)
				.ToListAsync();
			}
			else
			{
				return BadRequest("Geçersiz rapor türü.");
			}


			return Ok(reports);
		}

	/*--------RAPOR EKLEME----------*/
		[HttpPost("add")]
		public async Task<ActionResult> AddReport(Tasks task)
		{
			var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (userIdClaim == null)
			{
				return Unauthorized(new { message = "Kullanıcı bilgileri eksik." });
			}

			var userId = int.Parse(userIdClaim);

			if (task == null)
			{
				return BadRequest("Geçersiz veri.");
			}

			task.UserId = userId;

			DateTime? FinishDate = null;

			if (task.ReportTypeId == 1) 
			{
				FinishDate = task.CreatedAt.AddDays(1);
			}
			else if (task.ReportTypeId == 2) 
			{
				FinishDate = task.CreatedAt.AddDays(7);
			}
			else if (task.ReportTypeId == 3) 
			{
				FinishDate = task.CreatedAt.AddMonths(1);
			}

			task.FinishDate = FinishDate;

			await _context.Tasks.AddAsync(task);
			await _context.SaveChangesAsync();

			return Ok();
		}

	/*--------STATUS KOLONU GÜNCELLEME----------*/
		[HttpPatch("updateStatus/{taskId}")]
		public async Task<ActionResult> UpdateTaskStatus(int taskId)
		{
			var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (userIdClaim == null)
			{
				return Unauthorized(new { message = "Kullanıcı bilgileri eksik." });
			}
			var userId = int.Parse(userIdClaim);

			var task = await _context.Tasks.FirstOrDefaultAsync(t => t.TaskId == taskId && t.UserId == userId);
			if (task == null)
			{
				return NotFound(new { message = "Görev bulunamadı." });
			}

			task.Status = true;

			await _context.SaveChangesAsync();

			return Ok(new { message = "Görev başarıyla güncellendi." });
		}

	/*--------RAPOR SİLME----------*/
		[HttpDelete("delete/{taskId}")]
		public async Task<ActionResult> DeleteReport(int taskId)
		{
			var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
			if (userIdClaim == null)
			{
				return Unauthorized(new { message = "Kullanıcı bilgileri eksik." });
			}
			var userId = int.Parse(userIdClaim);

			var task = await _context.Tasks.FirstOrDefaultAsync(t => t.TaskId == taskId && t.UserId == userId);
			if (task == null)
			{
				return NotFound(new { message = "Görev bulunamadı." });
			}

			_context.Tasks.Remove(task);

			await _context.SaveChangesAsync();

			return Ok(new { message = "Görev başarıyla silindi." });
		}



	}
}
