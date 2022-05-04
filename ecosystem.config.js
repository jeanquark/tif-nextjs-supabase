module.exports = {
	apps: [
		{
			name: 'NEXTJS_SUPABASE',
			exec_mode: 'cluster',
			instances: 'max', // Or a number of instances
			cwd: './current',
			// script: 'npm',
			script: './node_modules/next/dist/bin/next',
			args: 'start'
		}
	]
}