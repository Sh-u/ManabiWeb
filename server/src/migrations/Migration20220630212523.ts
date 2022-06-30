import { Migration } from '@mikro-orm/migrations';

export class Migration20220630212523 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "card" add column "dictionary_meaning" text null, add column "pitch_accent" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "card" drop column "dictionary_meaning";');
    this.addSql('alter table "card" drop column "pitch_accent";');
  }

}
