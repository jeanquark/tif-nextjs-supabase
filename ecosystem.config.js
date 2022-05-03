module.exports = {
	apps: [
		{
			name: 'NEXTJS_SUPABASE',
			exec_mode: 'cluster',
			instances: 'max', // Or a number of instances
			cwd: './',
			script: 'next',
			args: 'start'
		}
	]
}