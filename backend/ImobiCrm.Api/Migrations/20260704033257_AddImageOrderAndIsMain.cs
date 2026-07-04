using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ImobiCrm.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddImageOrderAndIsMain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsMain",
                table: "PropertyImages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "PropertyImages",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsMain",
                table: "PropertyImages");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "PropertyImages");
        }
    }
}
