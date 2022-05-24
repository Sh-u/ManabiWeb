"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220524161804 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220524161804 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "post" add column "word" text not null, add column "user_audio" text null;');
        this.addSql('alter table "post" rename column "title" to "sentence";');
        this.addSql('alter table "post" rename column "audio" to "dictionary_audio";');
    }
    async down() {
        this.addSql('alter table "post" add column "title" text not null, add column "audio" text null;');
        this.addSql('alter table "post" drop column "sentence";');
        this.addSql('alter table "post" drop column "word";');
        this.addSql('alter table "post" drop column "dictionary_audio";');
        this.addSql('alter table "post" drop column "user_audio";');
    }
}
exports.Migration20220524161804 = Migration20220524161804;
//# sourceMappingURL=Migration20220524161804.js.map