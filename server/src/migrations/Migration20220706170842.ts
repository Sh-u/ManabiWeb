import { Migration } from '@mikro-orm/migrations';

export class Migration20220706170842 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pitch_accent" add column "word" jsonb null, add column "kana" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pitch_accent" drop column "word";');
    this.addSql('alter table "pitch_accent" drop column "kana";');
  }

}
