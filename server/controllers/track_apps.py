import psutil
import platform
import socket
import winsound
import pywifi
import time
from datetime import datetime
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
from pymongo import MongoClient
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from sklearn.linear_model import LinearRegression
from scapy.all import sniff, IP
from browser_history import get_history
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from dotenv import load_dotenv  # Import the dotenv module
import os  # Import the os module to access environment variables

# Load environment variables from .env file
load_dotenv()

# MongoDB connection
mongo_url = os.getenv('MONGO_URL')  # Read MongoDB URI from environment variables
client = MongoClient(mongo_url)


# Define system-related process names for each OS
system_processes_windows = [
    'System', 'Idle', 'svchost.exe', 'csrss.exe', 'winlogon.exe', 'services.exe',
    'lsass.exe', 'smss.exe', 'Registry', 'MemCompression', 'dwm.exe'
]

system_processes_linux = [
    'init', 'kthreadd', 'ksoftirqd', 'migration', 'watchdog', 'kworker', 'rcu', 
    'systemd', 'kdevtmpfs', 'bioset', 'kblockd', 'ata_sff', 'khubd', 'kseriod', 
    'md', 'jbd2', 'ext4', 'kvm', 'kswapd', 'fsnotify', 'kthrotld', 'acpi_thermal_pm'
]

system_processes_macos = [
    'kernel_task', 'launchd', 'syslogd', 'UserEventAgent', 'universalaccessd',
    'WindowServer', 'kextd', 'fseventsd', 'mds', 'mdworker', 'distnoted', 
    'cfprefsd', 'securityd', 'systemstats', 'coreaudiod', 'hidd'
]

# Minimum PID for user processes (system processes typically have low PIDs)
min_pid_user = 200

cheating_collection = client['cheating_devices'].cheating_devices

def get_running_processes():
    """Retrieve a list of currently running processes excluding OS and system-related processes."""
    
    # Detect the current operating system
    current_os = platform.system().lower()
    
    # Choose system process list based on the OS
    if current_os == 'windows':
        system_processes = system_processes_windows
    elif current_os in ['linux', 'fedora']:
        system_processes = system_processes_linux
    elif current_os == 'darwin':
        system_processes = system_processes_macos
    else:
        system_processes = []  # For unsupported OS, no filtering

    running_processes = []
    
    for process in psutil.process_iter(['pid', 'name', 'create_time', 'username']):
        try:
            # Exclude system processes by name or PID (system processes often have low PIDs)
            if process.info['name'] not in system_processes and process.info['pid'] > min_pid_user:
                running_processes.append((process.info['pid'], process.info['name'], process.info['create_time']))
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue  # Handle processes that may terminate during iteration
    
    return running_processes

def play_high_volume_sound():
    """Play a high volume sound when a browser is closed."""
    frequency = 2500  # Set the frequency of the sound (in Hz)
    duration = 1000   # Set the duration of the sound (in milliseconds)
    winsound.Beep(frequency, duration)  # Play the sound on Windows

def close_all_browsers():
    # Define browser process names for different operating systems
    if platform.system().lower() == 'windows':
        browsers = ['firefox.exe', 'msedge.exe', 'safari.exe']  # For Windows
    elif platform.system().lower() == 'darwin':  # macOS
        browsers = ['Google Chrome', 'firefox', 'safari']
    elif platform.system().lower() in ['linux', 'fedora']:  # Linux and Fedora
        browsers = ['google-chrome', 'firefox', 'chromium', 'opera', 'safari']  # Modify based on your browser preferences
    else:
        browsers = []  # For unsupported OS, no browser processes to close
    
    # Iterate through all running processes
    for proc in psutil.process_iter(attrs=['pid', 'name']):
        try:
            if proc.info['name'] in browsers:  # Check if the process is one of the browsers
                proc.terminate()  # Terminate the browser process
                print(f"Terminated browser process: {proc.info['name']} (PID: {proc.info['pid']})")
                play_high_volume_sound()
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass  # Handle processes that might terminate while we're iterating

def resolve_ip_to_host(ip_address):
    """Resolve an IP address to a hostname."""
    try:
        return socket.gethostbyaddr(ip_address)[0]
    except socket.herror:
        return None

def capture_network_requests(packet, mac_address):
    """Capture network requests and store source and destination details in MongoDB."""
    if IP in packet:
        src_ip = packet[IP].src
        dst_ip = packet[IP].dst

        # Try to resolve IPs to hostnames (URLs)
        src_url = resolve_ip_to_host(src_ip)
        dst_url = resolve_ip_to_host(dst_ip)

        print(f"Network request captured:")
        print(f"Source IP: {src_ip} ({src_url if src_url else 'N/A'})")
        print(f"Destination IP: {dst_ip} ({dst_url if dst_url else 'N/A'})")
        print("-" * 40)

        # Store the network request details in MongoDB
        db = client[mac_address]
        collection = db[f'network_requests_{mac_address}']
        request_details = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'source_ip': src_ip,
            'source_url': src_url if src_url else 'N/A',
            'destination_ip': dst_ip,
            'destination_url': dst_url if dst_url else 'N/A'
        }
        collection.insert_one(request_details)

def start_network_capture(mac_address):
    """Start capturing network requests."""
    print("Starting network packet capture...")
    sniff(filter="ip", prn=lambda x: capture_network_requests(x, mac_address), store=0)


def collect_network_details(mac_address):
    """Collect and store network details in MongoDB."""
    db = client[mac_address]
    collection = db[f'network_details_{mac_address}']

    network_info = []
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    for interface, addrs in psutil.net_if_addrs().items():
        details = {
            'timestamp': current_time,
            'interface': interface,
            'ip_address': None,
            'netmask': None,
            'broadcast': None
        }
        for addr in addrs:
            if addr.family == socket.AF_INET:
                details['ip_address'] = addr.address
                details['netmask'] = addr.netmask
                details['broadcast'] = addr.broadcast

        if details['ip_address']:
            network_info.append(details)

    if network_info:
        collection.insert_many(network_info)

    print(f"Network details updated for MAC address {mac_address}.")

def collect_connected_devices(mac_address):
    """Collect and store connected devices details in MongoDB and handle device removal."""
    db = client[mac_address]
    collection = db[f'connected_devices_details_{mac_address}']

    # Load previously stored devices from the database
    previous_devices = {doc['Device Name']: doc for doc in collection.find()}

    # Get current time
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # List to store all connected devices
    connected_devices = []
    pen_drive_detected = False

    # Detect platform
    current_os = platform.system().lower()

    # Collect Wi-Fi devices based on platform
    if current_os == 'windows':
        wifi = pywifi.PyWiFi()
        iface = wifi.interfaces()[0]
        iface.scan()
        time.sleep(2)
        scan_results = iface.scan_results()

        # Collect Wi-Fi devices
        for device in scan_results:
            cleaned_device_name = device.ssid.strip()
            cleaned_mac_address = device.bssid.replace(':', '').upper()
            device_info = {
                'timestamp': current_time,
                'Device Type': 'Wi-Fi',
                'Device Name': cleaned_device_name,
                'MAC Address': cleaned_mac_address,
                'Signal Strength': device.signal
            }
            connected_devices.append(device_info)

    elif current_os in ['linux', 'fedora']:
        # On Linux/Fedora, use `iwconfig` to fetch Wi-Fi details (using `pywifi` as well for simplicity)
        wifi = pywifi.PyWiFi()
        iface = wifi.interfaces()[0]
        iface.scan()
        time.sleep(2)
        scan_results = iface.scan_results()

        # Collect Wi-Fi devices
        for device in scan_results:
            cleaned_device_name = device.ssid.strip()
            cleaned_mac_address = device.bssid.replace(':', '').upper()
            device_info = {
                'timestamp': current_time,
                'Device Type': 'Wi-Fi',
                'Device Name': cleaned_device_name,
                'MAC Address': cleaned_mac_address,
                'Signal Strength': device.signal
            }
            connected_devices.append(device_info)

    elif current_os == 'darwin':  # macOS
        # macOS doesn't have a straightforward way like `iwconfig`, use `system_profiler` for Wi-Fi details
        # This method is used for fetching Wi-Fi details on macOS
        wifi_details = []
        process = psutil.Popen(['system_profiler', 'SPNetworkDataType'], stdout=psutil.PIPE)
        stdout, stderr = process.communicate()
        wifi_info = stdout.decode().split('\n')

        # Extract relevant Wi-Fi information
        for line in wifi_info:
            if 'SSID' in line:
                cleaned_device_name = line.split(':')[1].strip()
                wifi_details.append(cleaned_device_name)

        # Collect Wi-Fi devices
        for device in wifi_details:
            device_info = {
                'timestamp': current_time,
                'Device Type': 'Wi-Fi',
                'Device Name': device,
                'MAC Address': 'N/A',  # MAC Address can't be fetched directly from system_profiler
                'Signal Strength': 'N/A'  # Signal Strength not available
            }
            connected_devices.append(device_info)

    else:
        print(f"Unsupported OS: {current_os}. Skipping Wi-Fi device collection.")

    # Collect removable storage devices (e.g., pen drives) for all platforms
    partitions = psutil.disk_partitions()
    for partition in partitions:
        if 'removable' in partition.opts:
            usage = psutil.disk_usage(partition.mountpoint)
            storage_info = {
                'timestamp': current_time,
                'Device Type': 'Secondary Storage',
                'Device Name': partition.device,
                'Mount Point': partition.mountpoint,
                'File System Type': partition.fstype,
                'Total Size (GB)': round(usage.total / (1024 ** 3),2),
                'Used Size (GB)': round(usage.used / (1024 ** 3),2),
                'Free Size (GB)': round(usage.free / (1024 ** 3),2),
            }
            connected_devices.append(storage_info)
            pen_drive_detected = True

    # Print connected devices details
    for device in connected_devices:
        print(f"Device Type: {device['Device Type']}")
        print(f"Device Name: {device.get('Device Name', 'N/A')}")
        print(f"MAC Address: {device.get('MAC Address', 'N/A')}")
        print(f"Signal Strength: {device.get('Signal Strength', 'N/A')}")
        print(f"Mount Point: {device.get('Mount Point', 'N/A')}")
        print(f"File System Type: {device.get('File System Type', 'N/A')}")
        print(f"Total Size (GB): {device.get('Total Size (GB)', 'N/A')}")
        print(f"Used Size (GB): {device.get('Used Size (GB)', 'N/A')}")
        print(f"Free Size (GB): {device.get('Free Size (GB)', 'N/A')}")
        print("-" * 40)

    # Remove entries for devices that are no longer connected
    current_device_names = {device['Device Name'] for device in connected_devices}
    for device_name in previous_devices:
        if device_name not in current_device_names:
            print(f"Removing device {device_name} from database.")
            collection.delete_many({'Device Name': device_name})

    # Print message if a pen drive is detected
    if pen_drive_detected:
        print("Pen drive detected.")
        # Insert into cheating_devices collection
        cheating_collection.insert_one({
            'mac_address': mac_address,
            'type_of_cheating': 'Pen drive detected',
            'timestamp': current_time
        })

    # Store connected devices in MongoDB
    if connected_devices:
        collection.insert_many(connected_devices)

    print(f"Connected devices details updated for MAC address {mac_address}.")
    return connected_devices, pen_drive_detected


def collect_application_usage(mac_address):
    """Collect and store application usage data in MongoDB."""
    print(f"Tracking MAC address: {mac_address}")
    db = client[mac_address]
    collection = db[f'process_details_{mac_address}']

    # Dictionary to track start times of running processes
    process_start_times = {}

    while True:
        running_processes = get_running_processes()
        current_time = datetime.now()

        # Track currently running processes
        current_pids = {pid for pid, _, _ in running_processes}

        # Check for processes that have ended
        ended_pids = set(process_start_times.keys()) - current_pids
        for pid in ended_pids:
            start_time = process_start_times[pid]['start_time']
            end_time = current_time
            duration_seconds = (end_time - start_time).total_seconds()
            duration_minutes = round(duration_seconds / 60,2)

            entry = {
                'timestamp': end_time.strftime('%Y-%m-%d %H:%M:%S'),
                'pid': pid,
                'name': process_start_times[pid]['name'],
                'start_time': start_time.strftime('%Y-%m-%d %H:%M:%S'),
                'end_time': end_time.strftime('%Y-%m-%d %H:%M:%S'),
                'duration_minutes': duration_minutes
            }
            collection.insert_one(entry)
            print(f"Application {process_start_times[pid]['name']} (PID: {pid}) closed. Duration: {duration_minutes:.2f} minutes.")

            # Remove the ended process from the tracking dictionary
            del process_start_times[pid]

        # Track new processes
        for pid, name, create_time in running_processes:
            if pid not in process_start_times:
                start_time = datetime.fromtimestamp(create_time)
                process_start_times[pid] = {'name': name, 'start_time': start_time}
                print(f"New application {name} (PID: {pid}) started at {start_time}.")

                # Check if the new process is a browser
                if name.lower() in ['firefox.exe', 'msedge.exe', 'safari.exe', 'Google Chrome', 'firefox', 'safari', 'google-chrome', 'chromium', 'opera']:
                    cheating_collection.insert_one({
                        'mac_address': mac_address,
                        'type_of_cheating': f'{name} opened',
                        'timestamp': start_time.strftime('%Y-%m-%d %H:%M:%S')
                    })

        print(f"Application usage data updated for MAC address {mac_address} at {current_time}")

def retrieve_application_usage(mac_address):
    """Retrieve application usage data from MongoDB."""
    db = client[mac_address]
    collection = db[f'process_details_{mac_address}']
    data = list(collection.find({}, {'_id': 0}))
    df = pd.DataFrame(data)

    # Handle missing 'name' fields
    if 'name' not in df.columns:
        df['name'] = 'Unknown'  # Add a default 'name' column if missing
    else:
        df['name'].fillna('Unknown', inplace=True)  # Replace NaN values with 'Unknown'

        # Handle missing 'duration_minutes' fields
    if 'duration_minutes' not in df.columns:
        df['duration_minutes'] = 0  # Add a default 'duration_minutes' column if missing
    else:
        df['duration_minutes'].fillna(0, inplace=True)  # Replace NaN values with 0

    print(df.columns)
    print(df.head())  # Debug: Print the first few rows of the DataFrame
    return df

# def plot_bar_chart(df):
#     """Plot a vertical bar chart of application usage."""
#     app_usage = df.groupby('name')['duration_minutes'].sum().sort_values(ascending=False)

#     plt.figure(figsize=(12, 8))
#     ax = app_usage.plot(kind='bar', color='skyblue')
#     plt.xticks(rotation=90, ha='center', fontsize=8)
#     plt.title('Application Usage (Total Minutes)', fontsize=14, pad=20)
#     plt.xlabel('Application Name', fontsize=12)
#     plt.ylabel('Total Usage (Minutes)', fontsize=12)
#     ax.grid(axis='y', linestyle='--', alpha=0.7)
#     plt.tight_layout()
#     plt.show()

# def plot_horizontal_bar_chart(df):
#     """Plot a horizontal bar chart of application usage."""
#     app_usage = df.groupby('name')['duration_minutes'].sum().sort_values(ascending=False)

#     plt.figure(figsize=(10, 12))
#     ax = app_usage.plot(kind='barh', color='lightgreen')
#     plt.yticks(fontsize=8)
#     plt.title('Application Usage (Total Minutes)', fontsize=14, pad=20)
#     plt.xlabel('Total Usage (Minutes)', fontsize=12)
#     plt.ylabel('Application Name', fontsize=12)
#     ax.grid(axis='x', linestyle='--', alpha=0.7)
#     plt.tight_layout()
#     plt.show()

# def plot_pie_chart(df):
#     """Plot a pie chart of application usage."""
#     app_usage = df.groupby('name')['duration_minutes'].sum().sort_values(ascending=False)

#     # Limit to top 10 applications for better readability
#     top_apps = app_usage.head(10)

#     plt.figure(figsize=(8, 8))
#     top_apps.plot(kind='pie', autopct='%1.1f%%', startangle=140, fontsize=10, colors=plt.cm.tab20.colors)
#     plt.title('Top 10 Applications by Usage (%)', fontsize=14, pad=20)
#     plt.ylabel('')  # Remove the default 'duration_minutes' label
#     plt.tight_layout()
#     plt.show()

# def plot_line_chart(df):
#     """Plot a line chart of application usage over time."""
#     df['timestamp'] = pd.to_datetime(df['timestamp'])  # Convert timestamp to datetime
#     df.set_index('timestamp', inplace=True)  # Set timestamp as the index

#     # Group by application and resample by day
#     app_usage_time_series = df.groupby('name')['duration_minutes'].resample('D').sum().unstack(level=0)

#     plt.figure(figsize=(12, 8))
#     for app in app_usage_time_series.columns:
#         plt.plot(app_usage_time_series.index, app_usage_time_series[app], label=app)

#     plt.title('Application Usage Over Time', fontsize=14, pad=20)
#     plt.xlabel('Date', fontsize=12)
#     plt.ylabel('Total Usage (Minutes)', fontsize=12)
#     plt.legend(loc='upper left', bbox_to_anchor=(1, 1), fontsize=8)  # Place legend outside the plot
#     plt.grid(linestyle='--', alpha=0.7)
#     plt.tight_layout()
#     plt.show()

# def plot_stacked_area_chart(df):
#     """Plot a stacked area chart of application usage over time."""
#     df['timestamp'] = pd.to_datetime(df['timestamp'])  # Convert timestamp to datetime
#     df.set_index('timestamp', inplace=True)  # Set timestamp as the index

#     # Group by application and resample by day
#     app_usage_time_series = df.groupby('name')['duration_minutes'].resample('D').sum().unstack(level=0)

#     plt.figure(figsize=(12, 8))
#     plt.stackplot(app_usage_time_series.index, app_usage_time_series.T, labels=app_usage_time_series.columns, colors=plt.cm.tab20.colors)
#     plt.title('Cumulative Application Usage Over Time', fontsize=14, pad=20)
#     plt.xlabel('Date', fontsize=12)
#     plt.ylabel('Total Usage (Minutes)', fontsize=12)
#     plt.legend(loc='upper left', bbox_to_anchor=(1, 1), fontsize=8)  # Place legend outside the plot
#     plt.grid(linestyle='--', alpha=0.7)
#     plt.tight_layout()
#     plt.show()

def collect_system_health_data():
    """Collect system health data like CPU, memory, and disk usage."""
    cpu_usage = psutil.cpu_percent(interval=1)
    memory_info = psutil.virtual_memory()
    disk_usage = psutil.disk_usage('/')
    
    return {
        'cpu_usage': cpu_usage,
        'memory_used': round(memory_info.used / (1024**3), 2),
        'memory_total': round(memory_info.total / (1024**3), 2),
        'disk_used': round(disk_usage.used / (1024**3), 2),
        'disk_total': round(disk_usage.total / (1024**3), 2),
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }

def collect_system_health_for_ml(mac_address):
    """Store system health data for machine learning."""
    db = client[mac_address]
    collection = db[f'system_health_{mac_address}']
    
    health_data = collect_system_health_data()
    collection.insert_one(health_data)

def train_predictive_model(mac_address):
    """Train the machine learning model for predictive maintenance."""
    db = client[mac_address]
    collection = db[f'system_health_{mac_address}']
    
    # Load data from MongoDB
    data = list(collection.find())
    if len(data) < 10:  # Ensure we have enough data to train
        print("Not enough data to train the model.")
        return None
    
    # Prepare data for model training
    X = []
    y = []
    
    for record in data:
        X.append([record['cpu_usage'], record['memory_used'], record['disk_used']])
        y.append(record['cpu_usage'])
    
    X = np.array(X)
    y = np.array(y)
    
    # Split the data into train and test sets (80% train, 20% test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train the model
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # Make predictions on both the training and test data
    train_predictions = model.predict(X_train)
    test_predictions = model.predict(X_test)
    
    # Calculate and print R-squared values
    train_accuracy = r2_score(y_train, train_predictions)
    test_accuracy = r2_score(y_test, test_predictions)
    
    print(f"Model accuracy on training data (R-squared): {train_accuracy:.2f}")
    print(f"Model accuracy on test data (R-squared): {test_accuracy:.2f}")
    
    return model

def predict_failure(mac_address, model):
    """Use the trained model to predict potential failures."""
    health_data = collect_system_health_data()
    X_new = np.array([[health_data['cpu_usage'], health_data['memory_used'], health_data['disk_used']]])
    
    # Predict failure likelihood based on current system state
    prediction = model.predict(X_new)[0]
    
    # If CPU usage is predicted to exceed a threshold, trigger an alert
    if prediction > 90:  # Example threshold, you can adjust this
        print(f"Warning: High CPU usage predicted ({prediction:.2f}%)! System might require maintenance soon.")
        db = client[mac_address]
        alert_collection = db[f'failure_alerts_{mac_address}']
        alert_collection.insert_one({
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'predicted_cpu_usage': prediction,
            'alert': 'High CPU usage predicted. Possible maintenance required.'
        })

# Start monitoring system health data and train/predict with ML model
def monitor_with_ml(mac_address):
    """Collect system health data and predict failures using machine learning."""
    model = None
    while True:
        collect_system_health_for_ml(mac_address)
        
        # Train model every 10 iterations (can adjust this frequency)
        if not model or int(time.time()) % 10 == 0:
            model = train_predictive_model(mac_address)
        
        # Make failure prediction if model exists
        if model:
            predict_failure(mac_address, model)


def retrieve_browser_history(mac_address):
    """Retrieve and store browser history details in MongoDB."""
    start_time = datetime.now()
    date_only = start_time.strftime('%Y-%m-%d')
    db = client[mac_address]
    collection = db[f'browser_history_{mac_address}']

    print("Starting browser history retrieval...")

    # Get the browser history
    try:
        history = get_history()  # Assuming get_history is defined elsewhere
        print("Retrieved browser history.")
    except Exception as e:
        print(f"Error retrieving browser history: {e}")
        return

    if not history:
        print("No browser history found.")
        return

    history_data = history.histories

    if not history_data:
        print("No browser history data found.")
        return

    entries = []

    # Function to validate entries (e.g., check for valid URL)
    def is_valid_entry(entry):
        """Check if the entry is valid."""
        if isinstance(entry, tuple) and len(entry) >= 2:
            timestamp, url, title = entry[:3]  # Extract only the first two elements (timestamp, url)
            # Check if the URL is valid
            if not isinstance(url, str) or not url.startswith('http'):
                return False
            return True
        return False

    # Iterate through the history data and filter out invalid entries
    for entry in history_data:
        if is_valid_entry(entry):
            timestamp, url, title = entry[:3]  # Extract the timestamp and url
            # Convert timestamp to a string in the desired format
            timestamp_str = timestamp.strftime('%Y-%m-%d %H:%M:%S')
            timestamp_dt = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
            timestamp_date_only = timestamp_dt.strftime('%Y-%m-%d')
            if timestamp_date_only >= date_only:
                entry_data = {
                    'timestamp': timestamp_str,
                    'url': url,
                    'title': title
                }
                print(f"Adding entry: {entry_data}")
                entries.append(entry_data)

    # Sort entries by timestamp in decreasing order
    entries.sort(key=lambda x: x['timestamp'], reverse=True)

    # Insert only valid entries into the collection
    if entries:
        try:
            result = collection.insert_many(entries)
            print(f"Inserted {len(entries)} entries into the database.")
        except Exception as e:
            print(f"Error inserting entries into the database: {e}")
            return

    # Check if collection exists after insertion
    if collection.count_documents({}) > 0:
        print("Browser history data successfully stored.")
        return
    else:
        print("No browser history data stored.")
        return


class FileChangeHandler(FileSystemEventHandler):
    """Handle file system events."""
    def on_modified(self, event):
        if not event.is_directory:
            print(f"File modified: {event.src_path}")

    def on_created(self, event):
        if not event.is_directory:
            print(f"File created: {event.src_path}")

    def on_deleted(self, event):
        if not event.is_directory:
            print(f"File deleted: {event.src_path}")

if __name__ == "__main__":
    mac_address = input("Enter the MAC address to track: ")
    
    # Start monitoring in separate threads
    import threading

    def monitor_network_details():
        while True:
            collect_network_details(mac_address)
            time.sleep(300)  # Check every 5 minutes

    def monitor_connected_devices():
        while True:
            collect_connected_devices(mac_address)
            time.sleep(10)  # Check every 5 minutes

    def monitor_application_usage():
        while True:
            collect_application_usage(mac_address)
            time.sleep(10)

    def monitor_machine_learning():
        while True:
            monitor_with_ml(mac_address)
            time.sleep(300)

    def monitor_network_requests():
        while True:
            start_network_capture(mac_address)
            time.sleep(300)

    def monitor_browser_history():
        while True:
            retrieve_browser_history(mac_address)
            time.sleep(10)

    def monitor_all_browsers():
        while True:
            close_all_browsers()
            time.sleep(10)

    # def plot_graphs():
    #     df = retrieve_application_usage(mac_address)
    #     plot_bar_chart(df)
    #     plot_horizontal_bar_chart(df)
    #     plot_pie_chart(df)
    #     plot_line_chart(df)
    #     plot_stacked_area_chart(df)
    #     time.sleep(10)  # Check every 5 minutes

    # Start threads for monitoring
    threading.Thread(target=monitor_browser_history, daemon=True).start()
    threading.Thread(target=monitor_network_details, daemon=True).start()
    threading.Thread(target=monitor_connected_devices, daemon=True).start()
    threading.Thread(target=monitor_application_usage, daemon=True).start()
    threading.Thread(target=monitor_machine_learning, daemon=True).start()
    threading.Thread(target=monitor_network_requests, daemon=True).start()
    threading.Thread(target=monitor_all_browsers, daemon=True).start()
    # threading.Thread(target=plot_graphs, daemon=True).start()

    # Set up file system monitoring
    path_to_watch = "."  # Monitor the current directory
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path_to_watch, recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

# def get_mac_address():
#     """Automatically get the MAC address of the machine, excluding loopback and virtual interfaces."""
#     for interface, addrs in psutil.net_if_addrs().items():
#         if interface != "lo":  # Exclude loopback
#             for addr in addrs:
#                 if addr.family == psutil.AF_LINK and not addr.address.startswith("00:00:00"):  # Check for valid MAC
#                     return addr.address.replace(':', '_').upper()
#     return None  # Return None if no valid MAC address is found