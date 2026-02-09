import os

def combine_files(output_file, excluded_dirs=None, excluded_files=None, angular_frontend_dir=None, angular_backend_dir=None):
    """
    Combines code files from Angular frontend and backend directories into a single Markdown file.
    Supports Angular 21 projects with common file types like TypeScript, HTML, SCSS, JSON, etc.
    """
    if excluded_dirs is None:
        excluded_dirs = []
    if excluded_files is None:
        excluded_files = []

    # Angular-specific exclusions
    angular_excluded_dirs = excluded_dirs + [
        'node_modules', '.git', 'dist', 'build', '.angular', 'cache', '__pycache__',
        'venv', 'env', 'migrations', 'staticfiles', 'media', 'coverage'
    ]
    angular_excluded_files = excluded_files + [
        'README.md', 'readme.md', 'package-lock.json', 'yarn.lock',
        'tsconfig.json', 'angular.json', 'nx.json', 'jest.config.js',
        'db.sqlite3', '.gitignore', 'merge_code.py', 'projectcodecombined.md'
    ]

    angular_file_exts = {
        '.ts': 'typescript',
        '.html': 'html',
        '.css': 'css',
        '.scss': 'scss',
        '.sass': 'sass',
        '.js': 'javascript',
        '.json': 'json',
        '.md': 'markdown'
    }

    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write('# Angular 21 Frontend and Backend Code Merge\n\n')

        # Process Angular Frontend
        if angular_frontend_dir:
            outfile.write('## Angular Frontend\n\n')
            for root, dirs, files in os.walk(angular_frontend_dir):
                dirs[:] = [d for d in dirs if d not in angular_excluded_dirs and not d.startswith('.')]
                for file in files:
                    if file in angular_excluded_files:
                        continue
                    filepath = os.path.join(root, file)
                    relpath = os.path.relpath(filepath, angular_frontend_dir)
                    try:
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                        outfile.write(f'### File: {relpath}\n\n')
                        ext = os.path.splitext(file)[1].lower()
                        lang = angular_file_exts.get(ext, '')
                        if lang:
                            outfile.write(f'``` {lang}\n')
                        else:
                            outfile.write('```\n')
                        outfile.write(content)
                        outfile.write('\n```\n\n---\n\n')
                    except Exception as e:
                        print(f"Could not read {filepath}: {e}")

        # Process Angular Backend (assuming Node.js/Express or similar for Angular fullstack)
        if angular_backend_dir:
            outfile.write('## Angular Backend\n\n')
            for root, dirs, files in os.walk(angular_backend_dir):
                dirs[:] = [d for d in dirs if d not in angular_excluded_dirs and not d.startswith('.')]
                for file in files:
                    if file in angular_excluded_files:
                        continue
                    filepath = os.path.join(root, file)
                    relpath = os.path.relpath(filepath, angular_backend_dir)
                    try:
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                        outfile.write(f'### File: {relpath}\n\n')
                        ext = os.path.splitext(file).lower()[1]
                        lang = angular_file_exts.get(ext, ext[1:] if ext else '')
                        if lang:
                            outfile.write(f'``` {lang}\n')
                        else:
                            outfile.write('```\n')
                        outfile.write(content)
                        outfile.write('\n```\n\n---\n\n')
                    except Exception as e:
                        print(f"Could not read {filepath}: {e}")

    print(f"Done! All Angular 21 frontend and backend code combined into {output_file}")

if __name__ == "__main__":
    output_filename = "angular21-project-combined.md"
    
    # Update these paths to your Angular frontend and backend directories
    angular_frontend = "agrivendia-frontend"  # e.g., your Angular 21 app dir
    angular_backend = "agrivendia-backend"    # e.g., your Node/Express backend dir (if separate)
    
    excluded_folders = []  # Add custom exclusions if needed
    excluded_files_list = []  # Add custom exclusions if needed
    
    combine_files(
        output_filename,
        excluded_dirs=excluded_folders,
        excluded_files=excluded_files_list,
        angular_frontend_dir=angular_frontend,
        angular_backend_dir=angular_backend
    )
