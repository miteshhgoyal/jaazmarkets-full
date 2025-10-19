import os


"""
Extract the content of specified files from specified folders into files-content.txt.

USAGE OPTIONS:

1. Search for specific files in all folders:
   - Set folders_to_search = []
   - Set files_to_find = ["file1.js", "file2.js", ...]
   - Set process_all_files_in_folders = []

2. Search for specific files only in selected folders:
   - Set folders_to_search = ["backend", "frontend", "admin-frontend"]
   - Set files_to_find = ["index.js", "server.js", "crypto/page.js"]
   - Set process_all_files_in_folders = []

3. Process ALL files in specific folders (including nested):
   - Set folders_to_search = [] (can be empty or specific folders)
   - Set files_to_find = [] (can be empty)
   - Set process_all_files_in_folders = ["app/components/", "src/utils/"]
   
4. Combine approaches:
   - Set specific files to find AND folders to process all files from
   - Both will be processed and combined in the output

After running, results are saved into files-content.txt with file paths and contents.
"""

# Search only in these folders (leave empty to search all folders)
folders_to_search = []

# Specific files to find (can include nested paths)
files_to_find = [
    
]

# Process ALL files in these folders (including all nested subfolders)
# Example: ["app/components/", "src/utils/", "lib/"]
process_all_files_in_folders = ['src/components/legal/', 'src/app/legal/']

# File extensions to include when processing all files in folders
# Leave empty to include all files, or specify extensions like ['.js', '.jsx', '.ts', '.tsx', '.py']
allowed_extensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.json', '.md', '.txt', '.css', '.scss']


"""
All internal functioning goes below.
"""


def should_skip_directory(dir_name):
    """Check if directory should be skipped"""
    skip_dirs = {
        '.expo', 'node_modules', '.git', '__pycache__', 
        '.vscode', '.idea', 'dist', 'build', '.next',
        'coverage', '.nyc_output', 'logs', 'temp', 'tmp'
    }
    return dir_name in skip_dirs or dir_name.startswith('.')


def should_skip_file(filename, allowed_extensions):
    """Check if file should be skipped based on extension"""
    if not allowed_extensions:  # If no extensions specified, include all files
        return False
    
    _, ext = os.path.splitext(filename)
    return ext.lower() not in [e.lower() for e in allowed_extensions]


def normalize_path(path):
    """Normalize path separators for cross-platform compatibility"""
    return path.replace('\\', '/').replace('//', '/')


def matches_target_file(file_path, target_files, root_dir):
    """
    Check if the current file path matches any of the target files
    Handles both exact filenames and nested folder structures
    """
    # Get relative path from root directory
    relative_path = os.path.relpath(file_path, root_dir)
    relative_path = normalize_path(relative_path)
    
    # Get just the filename
    filename = os.path.basename(file_path)
    
    for target in target_files:
        target_normalized = normalize_path(target)
        
        # Check for exact filename match
        if filename == target_normalized:
            return True
            
        # Check for exact relative path match
        if relative_path == target_normalized:
            return True
            
        # Check if the file path ends with the target path (for nested structures)
        if relative_path.endswith(target_normalized):
            # Make sure it's a proper path match, not just string ending
            if relative_path == target_normalized or relative_path.endswith('/' + target_normalized):
                return True
    
    return False


def is_in_process_all_folders(file_path, process_folders, root_dir):
    """
    Check if the current file is within any of the folders marked for complete processing
    """
    if not process_folders:
        return False
    
    relative_path = os.path.relpath(file_path, root_dir)
    relative_path = normalize_path(relative_path)
    
    for folder in process_folders:
        # Handle both absolute-style paths and relative paths
        folder_normalized = normalize_path(folder.strip('/'))
        
        # Remove leading slash if present (for paths like '/src/app/components/')
        if folder_normalized.startswith('/'):
            folder_normalized = folder_normalized[1:]
        
        print(f"DEBUG: Checking if '{relative_path}' is in folder '{folder_normalized}'")
        
        # Check if the file is within this folder
        if (relative_path.startswith(folder_normalized + '/') or 
            relative_path.startswith(folder_normalized) or
            relative_path == folder_normalized):
            print(f"DEBUG: MATCH FOUND!")
            return True
    
    return False


def write_file_content(out_file, file_path, root_dir, reason=""):
    """Write file content to output file"""
    try:
        out_file.write(f"{'='*60}\n")
        out_file.write(f"FILE: {file_path}")
        if reason:
            out_file.write(f" ({reason})")
        out_file.write(f"\n")
        relative_path = os.path.relpath(file_path, root_dir)
        out_file.write(f"RELATIVE PATH: {normalize_path(relative_path)}\n")
        out_file.write(f"{'='*60}\n\n")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            out_file.write(content)
            out_file.write('\n\n')
        
        print(f"Processed: {file_path}" + (f" ({reason})" if reason else ""))
        return normalize_path(relative_path)
        
    except Exception as e:
        out_file.write(f"ERROR reading file: {str(e)}\n\n")
        print(f"Error processing {file_path}: {str(e)}")
        return None


def find_and_extract_files(target_files, process_folders, search_folders=None, root_dir='.', output_file='files-content.txt', allowed_extensions=None):
    """
    Search for specified files and process all files in specified folders, extracting their content to an output file
    
    Args:
        target_files: List of file names or paths to search for
        process_folders: List of folder paths to process all files from (including nested)
        search_folders: List of folder names to search inside (under root_dir). If None or empty list, search in all folders under root_dir
        root_dir: Root directory to start search from
        output_file: Output file to write results
        allowed_extensions: List of file extensions to include when processing folders (e.g., ['.js', '.py'])
    """
    
    if search_folders is None:
        search_folders = []
    if allowed_extensions is None:
        allowed_extensions = []
    
    found_files = []
    processed_files = {'specific': [], 'folder_all': []}
    
    with open(output_file, 'w', encoding='utf-8') as out_file:
        # Write header information
        out_file.write(f"File Extraction Report\n")
        out_file.write(f"Generated from: {os.path.abspath(root_dir)}\n")
        out_file.write(f"{'='*80}\n\n")
        
        if target_files:
            out_file.write(f"SEARCHING FOR SPECIFIC FILES:\n")
            for tf in target_files:
                out_file.write(f"  - {tf}\n")
            out_file.write(f"\n")
        
        if process_folders:
            out_file.write(f"PROCESSING ALL FILES IN FOLDERS:\n")
            for pf in process_folders:
                out_file.write(f"  - {pf}\n")
            if allowed_extensions:
                out_file.write(f"  Extensions: {', '.join(allowed_extensions)}\n")
            out_file.write(f"\n")
        
        out_file.write(f"{'='*80}\n\n")
        
        for root, dirs, files in os.walk(root_dir):
            # Skip unwanted directories
            dirs[:] = [d for d in dirs if not should_skip_directory(d)]
            
            # If specific folders are specified for searching, filter by them
            if len(search_folders) > 0:
                is_root = (os.path.abspath(root) == os.path.abspath(root_dir))
                if not is_root:
                    relative_path = os.path.relpath(root, root_dir)
                    top_folder = relative_path.split(os.sep)[0]
                    if top_folder not in search_folders:
                        dirs[:] = []
                        continue
            
            # Check each file in current directory
            for file in files:
                file_path = os.path.join(root, file)
                file_processed = False
                
                # Check if this file matches any target file (specific file search)
                if target_files and matches_target_file(file_path, target_files, root_dir):
                    result = write_file_content(out_file, file_path, root_dir, "specific file match")
                    if result:
                        processed_files['specific'].append(result)
                        file_processed = True
                
                # Check if this file is in a folder marked for complete processing
                if process_folders and is_in_process_all_folders(file_path, process_folders, root_dir):
                    if not should_skip_file(file, allowed_extensions):
                        if not file_processed:  # Avoid duplicating files already processed
                            result = write_file_content(out_file, file_path, root_dir, "folder processing")
                            if result:
                                processed_files['folder_all'].append(result)
                        file_processed = True
    
    # Combine all processed files
    all_processed = processed_files['specific'] + processed_files['folder_all']
    
    # Print summary
    print(f"\n{'='*50}")
    print(f"PROCESSING COMPLETE")
    print(f"{'='*50}")
    
    if processed_files['specific']:
        print(f"\nFound and processed {len(processed_files['specific'])} specific files:")
        for file_path in processed_files['specific']:
            print(f"  - {file_path}")
    
    if processed_files['folder_all']:
        print(f"\nProcessed {len(processed_files['folder_all'])} files from specified folders:")
        for file_path in processed_files['folder_all']:
            print(f"  - {file_path}")
    
    print(f"\nTotal files processed: {len(all_processed)}")
    
    # Check for missing specific files
    if target_files:
        missing_files = []
        for target in target_files:
            target_found = False
            for found in all_processed:
                if found.endswith(normalize_path(target)) or os.path.basename(found) == target:
                    target_found = True
                    break
            if not target_found:
                missing_files.append(target)
        
        if missing_files:
            print(f"\nSpecific files not found:")
            for missing in missing_files:
                print(f"  - {missing}")
    
    print(f"\nResults saved to: {output_file}")


if __name__ == "__main__":
    print('-'*50)
    print("Starting file extraction...")
    print('-'*50)
    
    # Validate configuration
    if not files_to_find and not process_all_files_in_folders:
        print("WARNING: Both 'files_to_find' and 'process_all_files_in_folders' are empty.")
        print("No files will be processed. Please configure at least one of these options.")
    else:
        find_and_extract_files(
            target_files=files_to_find,
            process_folders=process_all_files_in_folders,
            search_folders=folders_to_search,
            allowed_extensions=allowed_extensions
        )
    
    print('-'*50)