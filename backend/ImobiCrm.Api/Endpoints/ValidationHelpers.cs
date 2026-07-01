using System.ComponentModel.DataAnnotations;

namespace ImobiCrm.Api.Endpoints;

public static class ValidationHelpers
{
    public static bool TryValidate<T>(T dto, out IDictionary<string, string[]> errors)
    {
        var context = new ValidationContext(dto!);
        var results = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(dto!, context, results, true);
        errors = results
            .SelectMany(r => r.MemberNames.DefaultIfEmpty(string.Empty)
                .Select(memberName => new { memberName, message = r.ErrorMessage ?? "Inválido" }))
            .GroupBy(x => x.memberName)
            .ToDictionary(g => g.Key, g => g.Select(x => x.message).ToArray());
        return isValid;
    }
}