using Application.Interface;

namespace Web.Helpers
{
    public class FileStorageService : IFileStorageService
    {
        public async Task<string> SaveProofFileAsync(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLower();
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
            if (!allowed.Contains(extension))
                throw new InvalidOperationException("Invalid file type.");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var wwwRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var target = Path.Combine(wwwRoot, "uploads");
            if (!Directory.Exists(target))
                Directory.CreateDirectory(target);

            var path = Path.Combine(target, fileName);
            using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/uploads/{fileName}";
        }
    }
}
