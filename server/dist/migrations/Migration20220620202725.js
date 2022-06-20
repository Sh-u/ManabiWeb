"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220620202725 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220620202725 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "post" alter column "sentence" drop default;');
        this.addSql('alter table "post" alter column "sentence" type text using ("sentence"::text);');
        this.addSql('alter table "post" alter column "word" drop default;');
        this.addSql('alter table "post" alter column "word" type text using ("word"::text);');
    }
    async down() {
        this.addSql('alter table "post" alter column "sentence" type text using ("sentence"::text);');
        this.addSql('alter table "post" alter column "sentence" set default \'\';');
        this.addSql('alter table "post" alter column "word" type text using ("word"::text);');
        this.addSql('alter table "post" alter column "word" set default \'\';');
    }
}
exports.Migration20220620202725 = Migration20220620202725;
//# sourceMappingURL=Migration20220620202725.js.map