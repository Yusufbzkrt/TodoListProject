namespace TodoList.Extensions
{
	public static class DateTimeExtensions
	{
		public static DateTime StartOfWeek(this DateTime dt, DayOfWeek startOfWeek = DayOfWeek.Monday)
		{
			int diff = dt.DayOfWeek - startOfWeek;

			if (diff < 0)
			{
				diff += 7;
			}

			return dt.AddDays(-diff).Date;
		}
	}
}
