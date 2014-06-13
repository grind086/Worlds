import os
import fnmatch
import subprocess
from zipfile import ZipFile

root = os.path.abspath("..")

def get_revision():
    # Try and write the mercurial revision out to the file 'revision.py'
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
    
def build():
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
