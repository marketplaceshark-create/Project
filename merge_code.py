import os

def combine_files(output_file, exclude_dirs, exclude_files):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        # Walk through the current directory
        for root, dirs, files in os.walk('.'):
            # Skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            
            for file in files:
                if file in exclude_files or file.endswith(('.pyc', '.png', '.jpg', '.sqlite3')):
                    continue
                
                file_path = os.path.join(root, file)
                # Get relative path for the header
                rel_path = os.path.relpath(file_path, '.')
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as infile:
                        content = infile.read()
                        
                        # Write the file header and start of markdown code block
                        outfile.write(f"## File: {rel_path}\n")
                        
                        # Check extension to set language for markdown
                        ext = file.split('.')[-1] if '.' in file else ''
                        if ext in ['html', 'js', 'css']:
                            lang = ext
                        elif ext == 'py':
                            lang = 'python'
                        else:
                            lang = ''
                            
                        outfile.write(f"```{lang}\n")
                        outfile.write(f"# Path: {rel_path}\n")
                        outfile.write(content)
                        outfile.write("\n```\n\n---\n\n")
                        
                except Exception as e:
                    print(f"Could not read {file_path}: {e}")

if __name__ == "__main__":
    # Settings
    output_filename = "project_code_combined.md"
    excluded_folders = ['venv', '.git', '__pycache__', 'migrations', 'staticfiles', 'media']
    excluded_files = ['README.md', 'db.sqlite3', '.gitignore', 'merge_code.py', 'manage.py', 'project_code_combined.md', 'ReadMe.md']
    
    combine_files(output_filename, excluded_folders, excluded_files)
    print(f"Done! All code combined into {output_filename}")