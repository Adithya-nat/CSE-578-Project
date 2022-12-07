import json
from os import listdir
from os.path import isfile, join


def get_all_status():
    repo_root = "/Users/akashkiran_shivakumar/PycharmProjects/CSE-578-Project"
    path = f"{repo_root}/data/processed/stackedbar/minute"
    files = [join(path, f) for f in listdir(path) if isfile(join(path, f)) and f.endswith(".csv")]
    s = set()
    for file_path in files:
        with open(file_path) as f:
            first_line = f.readline().strip('\n')
            arr = first_line.split(",")
            s.update(arr)
    s.discard("dest_ip")
    s.discard("date")
    ans = list(s)
    ans.sort(key=lambda x: int(x))
    status_file = f"{repo_root}/data/processed/stackedbar/status.json"
    with open(status_file, "w") as f:
        f.write(json.dumps(ans))


if __name__ == "__main__":
    get_all_status()
