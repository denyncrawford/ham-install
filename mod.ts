  
import { join } from 'https://deno.land/std@0.92.0/path/mod.ts'
import { ensureDir, exists } from 'https://deno.land/std@0.99.0/fs/mod.ts'
import { readLines } from 'https://deno.land/std@0.99.0/io/bufio.ts'
import bins from './ham.b.ts'

const args = Deno.args

const files = await bins;

const ham = files['ham.exe']

const name = 'ham';

const folder = Deno.build.os === 'windows'
  ? join(Deno.env.get('APPDATA') || Deno.cwd(), name)
  : join(Deno.env.get('HOME') || Deno.cwd(), '.' + name);


  const writeBinary = async (dir: string) => {
    const libDir = join(dir, 'lib');
    const installed = await exists(libDir)
    if (installed) return;
    await ensureDir(libDir)
    await Deno.writeFile(join(dir, 'ham.exe'), ham)
  }

  await writeBinary(folder)

  const reader = Deno.run({ 
		cmd: [ join(folder, 'ham.exe'), ...args ],
		stdout: 'piped'
	});

	for await (const line of readLines(reader.stdout)) {
		console.log(line)
	}