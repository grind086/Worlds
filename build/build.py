import os
import fnmatch
import subprocess
from zipfile import ZipFile

root = os.path.abspath("..")
tmpdir = os.path.join(os.path.abspath("."), "temp")
outdir = os.path.join(os.path.abspath("."), "output")

compilation_level = "WHITESPACE_ONLY"
COMP_LEVELS = ["WHITESPACE_ONLY", "WHITESPACE_ONLY", "SIMPLE_OPTIMIZATIONS", "ADVANCED_OPTIMIZATIONS"];

def get_revision():
    # Try and get the git revision number
    try:
        process = subprocess.Popen(['git', 'rev-parse', '--verify', '--short', 'HEAD'], shell=False, stdout=subprocess.PIPE)
        output = process.communicate()
        
        return output[0].strip()
    except Exception, e:
        return "unknown"
        
# From PlayCanvas - see /engine/
def get_version():
    revision = get_revision()
    try:
        version_file = "../VERSION"
        f = open(version_file, "r")
        version = f.read().strip()
        f.close()
    except Exception, e:
        print(str(e))
        return "__CURRENT_GAME_VERSION__"
    return "-".join([version, revision])
    
def prep_submodules():
	# Build playcanvas
	buildPath = os.path.join(root, "engine", "build")
	os.chdir(buildPath)
	process = subprocess.Popen(["python", "build.py"], shell=False, stdout=subprocess.PIPE)
	process.communicate()

def build(dst):
    global compilation_level
    formatting = None
    # Set options
    if compilation_level == COMP_LEVELS[0]:
        formatting = "pretty_print"

    dependency_file = os.path.join(root, "dependencies.txt")
    compiler_path = os.path.join(root, "closure/compiler.jar")
    temp_path = os.path.join(root, "out.js")

    dependencies = open(dependency_file, "r");

    # Build and call command
    cmd = ["java", "-jar", compiler_path, "--compilation_level", compilation_level, "--js_output_file=" + temp_path, "--manage_closure_dependencies", "true"]
    if formatting:
        cmd.append("--formatting")
        cmd.append(formatting)

    # Use ECMA script 5 which supports getters and setters
    cmd.append("--language_in=ECMASCRIPT5")

    for file in dependencies:
        cmd.append( "--js=" + os.path.join(root, file.strip()))

    retcode = subprocess.call(cmd)

    # Copy output to build directory
    if not os.path.exists(os.path.dirname(dst)):
       os.mkdir(os.path.dirname(dst))
    shutil.move(temp_path, dst)

    return retcode

def build2():
    # Path to the package
    packageFile = os.path.abspath('package.nw')

    # Enter the app directory
    os.chdir('../app')

    # Create the file list
    packageFiles = []
    for root, dirs, filenames in os.walk('.'):
        for filename in filenames:
            packageFiles.append(os.path.join(root, filename))
            print 'Found file {0}'.format(packageFiles[-1])

    # Zip it all into the package file
    with ZipFile(packageFile, 'w') as nw:
        for f in packageFiles:
            nw.write(f)
            print 'Packaged file {0}'.format(f)

if __name__ == "__main__":
    version = get_version()
    print("==========\nBuild Version %s\n==========" % (version))
    prep_submodules()
