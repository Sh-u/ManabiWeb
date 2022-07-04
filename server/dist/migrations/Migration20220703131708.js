"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220703131708 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220703131708 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "pitch_accent" alter column "part" type jsonb using ("part"::jsonb);');
        this.addSql('alter table "pitch_accent" alter column "part" drop not null;');
        this.addSql('alter table "pitch_accent" alter column "high" type jsonb using ("high"::jsonb);');
        this.addSql('alter table "pitch_accent" alter column "high" drop not null;');
    }
    async down() {
        this.addSql('alter table "pitch_accent" alter column "part" type jsonb using ("part"::jsonb);');
        this.addSql('alter table "pitch_accent" alter column "part" set not null;');
        this.addSql('alter table "pitch_accent" alter column "high" type jsonb using ("high"::jsonb);');
        this.addSql('alter table "pitch_accent" alter column "high" set not null;');
    }
}
exports.Migration20220703131708 = Migration20220703131708;
//# sourceMappingURL=Migration20220703131708.js.map