import { Migration } from '@mikro-orm/migrations';

export class Migration20220523170856 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" add column "image" text null, add column "audio" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" drop column "image";');
    this.addSql('alter table "post" drop column "audio";');
  }

}
