import { Migration } from '@mikro-orm/migrations';

export class Migration20220711115156 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pitch_accent" drop column "high";');
    this.addSql('alter table "pitch_accent" add column "high" jsonb;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pitch_accent" alter column "high" type text[] using ("high"::text[]);');
  }

}
