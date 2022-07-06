"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220706175410 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220706175410 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "pitch_accent" alter column "descriptive" type text using ("descriptive"::text);');
        this.addSql('alter table "pitch_accent" alter column "mora" type int using ("mora"::int);');
        this.addSql('alter table "pitch_accent" alter column "word" type text using ("word"::text);');
        this.addSql('alter table "pitch_accent" alter column "kana" type text using ("kana"::text);');
    }
    async down() {
        this.addSql('alter table "pitch_accent" alter column "descriptive" type jsonb using ("descriptive"::jsonb);');
        this.addSql('alter table "pitch_accent" alter column "mora" type jsonb using ("mora"::jsonb);');
        this.addSql('alter table "pitch_accent" alter column "word" type jsonb using ("word"::jsonb);');
        this.addSql('alter table "pitch_accent" alter column "kana" type jsonb using ("kana"::jsonb);');
    }
}
exports.Migration20220706175410 = Migration20220706175410;
//# sourceMappingURL=Migration20220706175410.js.map