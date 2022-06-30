import { Migration } from '@mikro-orm/migrations';

export class Migration20220630215018 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "card" alter column "pitch_accent" type text[] using ("pitch_accent"::text[]);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "card" alter column "pitch_accent" type text using ("pitch_accent"::text);');
  }

}
