using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TodoList.Data;
using TodoList.Models;
using TodoList.Models.Dto;

namespace TodoList.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly IConfiguration _configuration;
		private readonly ApplicationDbContext _context;

		public AuthController(IConfiguration configuration, ApplicationDbContext context)
		{
			_configuration = configuration;
			_context = context;
		}


		/*---------REGİSTER-------------*/
		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
		{
			if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
			{
				return Conflict("Daha önce bu email ile bir kayıt var");
			}
			var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

			var user = new User
			{
				Name = registerDto.Name,
				Surname = registerDto.Surname,
				Email = registerDto.Email,
				Passwordhash = passwordHash 
			};

			await _context.Users.AddAsync(user);
			await _context.SaveChangesAsync();

			return Ok("Kullanıcı başarıyla kaydedildi");
		}


		/*---------LOGİN-------------*/
		[HttpPost("login")]
		public async Task<IActionResult> Login(LoginDto loginDto)
		{
			var user = await _context.Users
				.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
			if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Passwordhash))
			{
				return Unauthorized(new { message = "Geçersiz kullanıcı adı veya şifre" });
			}

			var tokenHandler = new JwtSecurityTokenHandler();
			var key = Encoding.UTF8.GetBytes(_configuration["Token:SecurityKey"]);
			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new[]
				{
					new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
					new Claim(ClaimTypes.Email, loginDto.Email),
				}),
				Expires = DateTime.UtcNow.AddMinutes(20),
				Issuer = _configuration["Token:Issuer"],
				Audience = _configuration["Token:Audience"],
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
			};

			var token = tokenHandler.CreateToken(tokenDescriptor);
			var tokenString = tokenHandler.WriteToken(token);

			return Ok(new { Token = tokenString });
		}
	}
}
