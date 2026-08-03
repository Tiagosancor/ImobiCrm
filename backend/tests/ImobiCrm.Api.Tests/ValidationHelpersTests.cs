using ImobiCrm.Api.Dtos;
using ImobiCrm.Api.Endpoints;
using Xunit;

namespace ImobiCrm.Api.Tests;

public class ValidationHelpersTests
{
    [Fact]
    public void TryValidate_RegisterDtoValido_RetornaTrue()
    {
        // Arrange
        var dto = new RegisterDto("Tiago Cordeiro", "tiago@email.com", "senha123");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.True(isValid);
        Assert.Empty(errors);
    }

    [Fact]
    public void TryValidate_RegisterDtoNameVazio_RetornaErroEmName()
    {
        // Arrange
        var dto = new RegisterDto(string.Empty, "tiago@email.com", "senha123");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Name"));
    }

    [Fact]
    public void TryValidate_RegisterDtoEmailInvalido_RetornaErroEmEmail()
    {
        // Arrange
        var dto = new RegisterDto("Tiago Cordeiro", "email-invalido", "senha123");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Email"));
    }

    [Fact]
    public void TryValidate_RegisterDtoSenhaCurta_RetornaErroEmPassword()
    {
        // Arrange
        var dto = new RegisterDto("Tiago Cordeiro", "tiago@email.com", "12345");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Password"));
    }

    [Fact]
    public void TryValidate_LoginDtoValido_RetornaTrue()
    {
        // Arrange
        var dto = new LoginDto("tiago@email.com", "senha123");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.True(isValid);
        Assert.Empty(errors);
    }

    [Fact]
    public void TryValidate_LoginDtoEmailInvalido_RetornaErroEmEmail()
    {
        // Arrange
        var dto = new LoginDto("email-invalido", "senha123");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Email"));
    }

    [Fact]
    public void TryValidate_LoginDtoSenhaVazia_RetornaErroEmPassword()
    {
        // Arrange
        var dto = new LoginDto("tiago@email.com", string.Empty);

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Password"));
    }

    [Fact]
    public void TryValidate_PropertyCreateDtoValido_RetornaTrue()
    {
        // Arrange
        var dto = CreateValidPropertyCreateDto();

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.True(isValid);
        Assert.Empty(errors);
    }

    [Fact]
    public void TryValidate_PropertyCreateDtoTitleVazio_RetornaErroEmTitle()
    {
        // Arrange
        var dto = CreateValidPropertyCreateDto() with { Title = string.Empty };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Title"));
    }

    [Fact]
    public void TryValidate_PropertyCreateDtoTitleMaiorQueLimite_RetornaErroEmTitle()
    {
        // Arrange
        var dto = CreateValidPropertyCreateDto() with { Title = new string('A', 301) };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Title"));
    }

    [Fact]
    public void TryValidate_PropertyCreateDtoPriceInvalido_RetornaErroEmPrice()
    {
        // Arrange
        var dto = CreateValidPropertyCreateDto() with { Price = 0m };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Price"));
    }

    [Fact]
    public void TryValidate_PropertyCreateDtoBedroomsInvalido_RetornaErroEmBedrooms()
    {
        // Arrange
        var dto = CreateValidPropertyCreateDto() with { Bedrooms = -1 };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Bedrooms"));
    }

    [Fact]
    public void TryValidate_PropertyCreateDtoBathroomsInvalido_RetornaErroEmBathrooms()
    {
        // Arrange
        var dto = CreateValidPropertyCreateDto() with { Bathrooms = 101 };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Bathrooms"));
    }

    [Fact]
    public void TryValidate_PropertyCreateDtoGarageSpacesInvalido_RetornaErroEmGarageSpaces()
    {
        // Arrange
        var dto = CreateValidPropertyCreateDto() with { GarageSpaces = 101 };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("GarageSpaces"));
    }

    [Fact]
    public void TryValidate_PropertyCreateDtoAreaInvalida_RetornaErroEmArea()
    {
        // Arrange
        var dto = CreateValidPropertyCreateDto() with { Area = 0.0 };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Area"));
    }

    [Fact]
    public void TryValidate_PropertyUpdateDtoValido_RetornaTrue()
    {
        // Arrange
        var dto = CreateValidPropertyUpdateDto();

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.True(isValid);
        Assert.Empty(errors);
    }

    [Fact]
    public void TryValidate_PropertyUpdateDtoTitleVazio_RetornaErroEmTitle()
    {
        // Arrange
        var dto = CreateValidPropertyUpdateDto() with { Title = string.Empty };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Title"));
    }

    [Fact]
    public void TryValidate_PropertyUpdateDtoTitleMaiorQueLimite_RetornaErroEmTitle()
    {
        // Arrange
        var dto = CreateValidPropertyUpdateDto() with { Title = new string('A', 301) };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Title"));
    }

    [Fact]
    public void TryValidate_PropertyUpdateDtoPriceInvalido_RetornaErroEmPrice()
    {
        // Arrange
        var dto = CreateValidPropertyUpdateDto() with { Price = 0m };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Price"));
    }

    [Fact]
    public void TryValidate_PropertyUpdateDtoBedroomsInvalido_RetornaErroEmBedrooms()
    {
        // Arrange
        var dto = CreateValidPropertyUpdateDto() with { Bedrooms = -1 };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Bedrooms"));
    }

    [Fact]
    public void TryValidate_PropertyUpdateDtoBathroomsInvalido_RetornaErroEmBathrooms()
    {
        // Arrange
        var dto = CreateValidPropertyUpdateDto() with { Bathrooms = 101 };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Bathrooms"));
    }

    [Fact]
    public void TryValidate_PropertyUpdateDtoGarageSpacesInvalido_RetornaErroEmGarageSpaces()
    {
        // Arrange
        var dto = CreateValidPropertyUpdateDto() with { GarageSpaces = 101 };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("GarageSpaces"));
    }

    [Fact]
    public void TryValidate_PropertyUpdateDtoAreaInvalida_RetornaErroEmArea()
    {
        // Arrange
        var dto = CreateValidPropertyUpdateDto() with { Area = 0.0 };

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Area"));
    }

    [Fact]
    public void TryValidate_LeadCreateDtoValido_RetornaTrue()
    {
        // Arrange
        var dto = new LeadCreateDto(1, "Lead de Exemplo", "lead@email.com", "11999999999", "Mensagem");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.True(isValid);
        Assert.Empty(errors);
    }

    [Fact]
    public void TryValidate_LeadCreateDtoNameVazio_RetornaErroEmName()
    {
        // Arrange
        var dto = new LeadCreateDto(1, string.Empty, "lead@email.com", "11999999999", "Mensagem");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Name"));
    }

    [Fact]
    public void TryValidate_LeadCreateDtoEmailInvalido_RetornaErroEmEmail()
    {
        // Arrange
        var dto = new LeadCreateDto(1, "Lead de Exemplo", "email-invalido", "11999999999", "Mensagem");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Email"));
    }

    [Fact]
    public void TryValidate_ChangePasswordDtoValido_RetornaTrue()
    {
        // Arrange
        var dto = new ChangePasswordDto("senhaAtual", "senhaNova123");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.True(isValid);
        Assert.Empty(errors);
    }

    [Fact]
    public void TryValidate_ChangePasswordDtoCurrentPasswordVazio_RetornaErroEmCurrentPassword()
    {
        // Arrange
        var dto = new ChangePasswordDto(string.Empty, "senhaNova123");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("CurrentPassword"));
    }

    [Fact]
    public void TryValidate_ChangePasswordDtoNewPasswordCurta_RetornaErroEmNewPassword()
    {
        // Arrange
        var dto = new ChangePasswordDto("senhaAtual", "12345");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("NewPassword"));
    }

    [Fact]
    public void TryValidate_RecoverDtoValido_RetornaTrue()
    {
        // Arrange
        var dto = new RecoverDto("recover@email.com");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.True(isValid);
        Assert.Empty(errors);
    }

    [Fact]
    public void TryValidate_RecoverDtoEmailVazio_RetornaErroEmEmail()
    {
        // Arrange
        var dto = new RecoverDto(string.Empty);

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Email"));
    }

    [Fact]
    public void TryValidate_RecoverDtoEmailInvalido_RetornaErroEmEmail()
    {
        // Arrange
        var dto = new RecoverDto("email-invalido");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Email"));
    }

    [Fact]
    public void TryValidate_ResetDtoValido_RetornaTrue()
    {
        // Arrange
        var dto = new ResetDto("token123", "senhaNova123");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.True(isValid);
        Assert.Empty(errors);
    }

    [Fact]
    public void TryValidate_ResetDtoTokenVazio_RetornaErroEmToken()
    {
        // Arrange
        var dto = new ResetDto(string.Empty, "senhaNova123");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("Token"));
    }

    [Fact]
    public void TryValidate_ResetDtoNewPasswordVazia_RetornaErroEmNewPassword()
    {
        // Arrange
        var dto = new ResetDto("token123", string.Empty);

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("NewPassword"));
    }

    [Fact]
    public void TryValidate_ResetDtoNewPasswordCurta_RetornaErroEmNewPassword()
    {
        // Arrange
        var dto = new ResetDto("token123", "12345");

        // Act
        var isValid = ValidationHelpers.TryValidate(dto, out var errors);

        // Assert
        Assert.False(isValid);
        Assert.True(errors.ContainsKey("NewPassword"));
    }

    private static PropertyCreateDto CreateValidPropertyCreateDto() =>
        new(
            "Apartamento central",
            "Descricao opcional",
            250000m,
            3,
            2,
            1,
            85.5,
            "Sao Paulo",
            "Centro");

    private static PropertyUpdateDto CreateValidPropertyUpdateDto() =>
        new(
            "Apartamento central",
            "Descricao opcional",
            250000m,
            3,
            2,
            1,
            85.5,
            "Sao Paulo",
            "Centro",
            true);
}