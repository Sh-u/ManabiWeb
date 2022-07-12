"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220712103457 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220712103457 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "pitch_accent" alter column "high" type text[] using ("high"::text[]);');
    }
    async down() {
        this.addSql('alter table "pitch_accent" alter column "high" type jsonb using ("high"::jsonb);');
    }
}
exports.Migration20220712103457 = Migration20220712103457;
//# sourceMappingURL=Migration20220712103457.js.map