import { Migration } from '@mikro-orm/migrations';

export class Migration20220703134042 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pitch_accent" alter column "part" type jsonb using ("part"::jsonb);');
    this.addSql('alter table "pitch_accent" alter column "part" set not null;');
    this.addSql('alter table "pitch_accent" alter column "high" type jsonb using ("high"::jsonb);');
    this.addSql('alter table "pitch_accent" alter column "high" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pitch_accent" alter column "part" type jsonb using ("part"::jsonb);');
    this.addSql('alter table "pitch_accent" alter column "part" drop not null;');
    this.addSql('alter table "pitch_accent" alter column "high" type jsonb using ("high"::jsonb);');
    this.addSql('alter table "pitch_accent" alter column "high" drop not null;');
  }

}
