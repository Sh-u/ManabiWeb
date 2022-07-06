import { Migration } from '@mikro-orm/migrations';

export class Migration20220706174429 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pitch_accent" drop column "part";');
    this.addSql('alter table "pitch_accent" drop column "high";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pitch_accent" add column "part" jsonb null, add column "high" jsonb null;');
  }

}
