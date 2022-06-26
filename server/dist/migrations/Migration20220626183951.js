"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20220626183951 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20220626183951 extends migrations_1.Migration {
    async up() {
        this.addSql('alter table "deck" alter column "steps" drop default;');
        this.addSql('alter table "deck" alter column "steps" type text[] using ("steps"::text[]);');
        this.addSql('alter table "deck" alter column "graduating_interval" drop default;');
        this.addSql('alter table "deck" alter column "graduating_interval" type int using ("graduating_interval"::int);');
        this.addSql('alter table "deck" alter column "starting_ease" drop default;');
        this.addSql('alter table "deck" alter column "starting_ease" type int using ("starting_ease"::int);');
        this.addSql('alter table "card_progress" alter column "state" drop default;');
        this.addSql('alter table "card_progress" alter column "state" type varchar(255) using ("state"::varchar(255));');
        this.addSql('alter table "card_progress" alter column "steps" drop default;');
        this.addSql('alter table "card_progress" alter column "steps" type int using ("steps"::int);');
    }
    async down() {
        this.addSql('alter table "deck" alter column "steps" type text[] using ("steps"::text[]);');
        this.addSql('alter table "deck" alter column "steps" set default \'{1,10,1400}\';');
        this.addSql('alter table "deck" alter column "graduating_interval" type int using ("graduating_interval"::int);');
        this.addSql('alter table "deck" alter column "graduating_interval" set default 1;');
        this.addSql('alter table "deck" alter column "starting_ease" type int using ("starting_ease"::int);');
        this.addSql('alter table "deck" alter column "starting_ease" set default 2.5;');
        this.addSql('alter table "card_progress" alter column "state" type varchar(255) using ("state"::varchar(255));');
        this.addSql('alter table "card_progress" alter column "state" set default \'Learn\';');
        this.addSql('alter table "card_progress" alter column "steps" type int using ("steps"::int);');
        this.addSql('alter table "card_progress" alter column "steps" set default 0;');
    }
}
exports.Migration20220626183951 = Migration20220626183951;
//# sourceMappingURL=Migration20220626183951.js.map