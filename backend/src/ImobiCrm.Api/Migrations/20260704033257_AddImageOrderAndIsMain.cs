using Microsoft.EntityFrameworkCore.Migrations;

namespace ImobiCrm.Api.Migrations
{
    public partial class AddImageOrderAndIsMain : Migration
    {
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
