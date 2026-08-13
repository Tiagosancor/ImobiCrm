using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ImobiCrm.Api.Migrations
{
    /// <inheritdoc />
    public partial class UnicidadeAssociacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ClientProperties_ClientId",
                table: "ClientProperties");

            migrationBuilder.CreateIndex(
                name: "IX_ClientProperties_ClientId_PropertyId",
                table: "ClientProperties",
                columns: new[] { "ClientId", "PropertyId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ClientProperties_ClientId_PropertyId",
                table: "ClientProperties");

            migrationBuilder.CreateIndex(
                name: "IX_ClientProperties_ClientId",
                table: "ClientProperties",
                column: "ClientId");
        }
    }
}
