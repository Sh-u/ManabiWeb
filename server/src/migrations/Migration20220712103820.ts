import { Migration } from '@mikro-orm/migrations';

export class Migration20220712103820 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pitch_accent" alter column "high" type jsonb using ("high"::jsonb);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pitch_accent" alter column "high" type text[] using ("high"::text[]);');
  }

}
