import os, time, xlrd, datetime, webbrowser, pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.service import Service

def get_previous_friday(date):
    date_obj = datetime.datetime.strptime(date, "%d/%m/%Y")
    weekday = date_obj.weekday()
    if weekday == 5:
        date_obj -= datetime.timedelta(days=1)
    elif weekday == 6:
        date_obj -= datetime.timedelta(days=2)
    return date_obj.strftime("%d-%b-%Y")

def check_date_range(date):
    date_obj = datetime.datetime.strptime(date, "%d-%b-%Y")
    start_date = datetime.datetime.strptime("24-Nov-2018", "%d-%b-%Y")
    end_date = datetime.datetime.today()
    return start_date <= date_obj < end_date

def check_new_file(directory, timeout=60):
    end_time = time.time() + timeout
    while time.time() < end_time:
        files = [f for f in os.listdir(directory) if f.endswith('.xls')]
        if files:
            files.sort(key=lambda x: os.path.getmtime(os.path.join(directory, x)), reverse=True)
            return os.path.join(directory, files[0])
        time.sleep(1)
    return None

def download_data(driver, url, download_dir):
    try:
        driver.get(url)
        time.sleep(2)
        if "valueresearchonline.com" in driver.current_url:
            print("Data not available, skipping to the next URL")
            return None
        new_file = check_new_file(download_dir)
        if new_file:
            print(f"File downloaded: {new_file}")
            return new_file
        else:
            print("No file downloaded.")
    except Exception as e:
        print(f"An error occurred during download: {str(e)}")
    finally:
        driver.quit()
    return None

def main():
    DATE = "23/06/2024"
    LAST_MARKET_DATE = get_previous_friday(DATE)

    if not check_date_range(LAST_MARKET_DATE):
        print(f"{DATE} out of available range (24/11/2018 - last market day as of today).")
        return

    primary_categories = ["SEQ", "SSO", "SOTH", "SDT", "SHY"]
    secondary_categories = ["SEQ_LC", "SEQ_LMC", "SEQ_FC", "SEQ_MLC", "SEQ_MC", "SEQ_SC", "SEQ_VAL", 
                            "SEQ_ELSS", "SEQ_CONT", "SEQ_DIVY", "SEQ_FOC", "SEQ_SCTH", "SSO_CHILD", 
                            "SSO_RETR", "SOTH_IXETF", "SOTH_FOFS", "SDT_LND", "SDT_MLD", "SDT_MD", 
                            "SDT_SD", "SDT_LWD", "SDT_USD", "SDT_LIQ", "SDT_MM", "SDT_OVNT", "SDT_DB", 
                            "SDT_CB", "SDT_CR", "SDT_BPSU", "SDT_FL", "SDT_FMP", "SDT_GL", "SDT_GL10CD", 
                            "SHY_AH", "SHY_BH", "SHY_CH", "SHY_EQS", "SHY_AR", "SHY_MAA", "SHY_DAABA"]

    all_data = pd.DataFrame()

    for pri in primary_categories:
        for sec in secondary_categories:
            if sec.startswith(pri):
                URL = f"https://www.valueresearchonline.com/downloads/amfi-performance-xls/?source_url=%2Famfi%2Ffund-performance-data%2F%3Fend-type%3D1%26primary-category%3D{pri}%26category%3D{sec}%26amc%3DALL%26nav-date%3D{LAST_MARKET_DATE}"
                chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

                options = webdriver.ChromeOptions()
                options.binary_location = chrome_path
                download_directory = os.getcwd()
                options.add_experimental_option("prefs", {
                    "download.default_directory": download_directory,
                    "download.prompt_for_download": False,
                    "download.directory_upgrade": True,
                    "safebrowsing.enabled": True
                })
                options.add_argument("--disable-extensions")
                driver = webdriver.Chrome(service=Service("./chromedriver"), options=options)

                driver.get(URL)
                if "valueresearchonline.com" in driver.current_url:
                    print(f"{pri}_{sec} Redirected to valueresearch.com, skipping to the next URL")
                    driver.quit()
                    continue
                
                new_file = check_new_file(download_directory)
                if new_file:
                    print(f"File downloaded: {new_file}")
                    file_size = -1
                    while file_size != os.path.getsize(new_file):
                        file_size = os.path.getsize(new_file)
                        time.sleep(1)

                    sheet = xlrd.open_workbook(new_file, ignore_workbook_corruption=True).sheet_by_index(0)
                    header_row = sheet.row_values(5)
                    data_rows = [sheet.row_values(row_index) for row_index in range(6, sheet.nrows)]
                    os.remove(new_file)

                    category_returns = pd.DataFrame(data_rows, columns=header_row)
                    category_returns.dropna(how='all', inplace=True)
                    category_returns = category_returns.reset_index(drop=True)
                    category_returns = category_returns.astype('string')
                    
                    for col in ['Return 3 Year (%) Direct', 'Return 3 Year (%) Benchmark', 'Return 5 Year (%) Direct', 'Return 5 Year (%) Benchmark', 'Return 10 Year (%) Direct', 'Return 10 Year (%) Benchmark', 'Return Since Launch Direct', 'Return Since Launch Benchmark']:
                        category_returns[col] = category_returns[col].replace(r'[^0-9.-]', '', regex=True)
                        category_returns[col] = pd.to_numeric(category_returns[col], errors='coerce').fillna(0)
                        category_returns[col] = category_returns[col].where(category_returns[col].notnull(), 0)

                    for years in [3, 5, 10]:
                        category_returns[f'Excess {years} yr'] = category_returns[f'Return {years} Year (%) Direct'] - category_returns[f'Return {years} Year (%) Benchmark']
                    category_returns['Excess Return Since Launch'] = category_returns[f'Return Since Launch Direct'] - category_returns[f'Return Since Launch Benchmark']
                    category_returns.drop(['Benchmark', 'Riskometer Scheme','NAV Date', 'NAV Regular', 'NAV Direct', 'Return 1 Year (%) Regular', 'Return 1 Year (%) Direct', 
                                           'Return 1 Year (%) Benchmark', 'Return 3 Year (%) Regular', 'Return 5 Year (%) Regular', 'Return 10 Year (%) Regular', 
                                           'Return Since Launch Regular', 'Return 7 Days (%) Regular', 'Return 7 Days (%) Direct', 'Return 7 Days (%) Benchmark', 
                                           'Return 15 Days (%) Regular', 'Return 15 Days (%) Direct', 'Return 15 Days (%) Benchmark', 'Return 1 Month (%) Regular', 
                                           'Return 1 Month (%) Direct', 'Return 1 Month (%) Benchmark', 'Return 3 Month (%) Regular', 'Return 3 Month (%) Direct',
                                           'Return 3 Month (%) Benchmark', 'Return 6 Month (%) Regular', 'Return 6 Month (%) Direct', 'Return 6 Month (%) Benchmark'], axis=1, inplace=True)
                    all_data = pd.concat([all_data, category_returns])
                else:
                    print("No file was downloaded or file name does not match the expected pattern.")
                driver.quit()

    all_data = all_data.sort_values(by='Return 5 Year (%) Direct', ascending=False)

    mf_data = pd.ExcelWriter(f'All_MF_returns_on_{LAST_MARKET_DATE}.xlsx')
    all_data.to_excel(mf_data, index=False)
    webbrowser.open('All_MF_returns_on_{LAST_MARKET_DATE}.xlsx') 
    mf_data.close()

if __name__ == "__main__":
    main()

document.addEventListener('DOMContentLoaded', function () {
    const mutualFundSelects = Array.from({ length: 5 }, (_, i) => document.getElementById(`mutual-fund-${i + 1}`));
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const fetchButton = document.getElementById('fetch-nav');
    const navChartCtx = document.getElementById('navChart').getContext('2d');
    const errorMessageDiv = document.getElementById('error-message');
    const dataTableDiv = document.getElementById('dataTable');

    const mutualFunds = [/* ... array of mutual fund names ... */];
    const colors = ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(153, 102, 255, 1)'];
    const styles = [[], [5, 5], [15, 3, 3, 3], [4, 8], [4, 4]];

    mutualFundSelects.forEach((select, index) => {
        mutualFunds.forEach((fund, fundIndex) => {
            const option = document.createElement('option');
            option.value = fundIndex + 222;
            option.text = fund;
            select.appendChild(option);
        });
    });

    fetchButton.addEventListener('click', async () => {
        const startDate = formatDate(startDateInput.value);
        const endDate = formatDate(endDateInput.value);

        if (startDate && endDate) {
            const selectedFunds = mutualFundSelects.map(select => select.value).filter(value => value !== "");
            if (selectedFunds.length === 0) {
                alert('Please select at least one fund.');
                return;
            }

            const allData = await Promise.all(selectedFunds.map(fundId => 
                fetchFundData(fundId, startDate, endDate)
            ));

            displayChart(allData);
            displayTable(allData);
        } else {
            alert('Please select a date range.');
        }
    });

    async function fetchFundData(fundId, startDate, endDate) {
        const urlAMFI = `https://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=${fundId}&frmdt=${startDate}&todt=${endDate}`;
        const amfiData = await fetchNAVHistory(urlAMFI);
        const valResData = await fetchValueResearchData(fundId, startDate, endDate);
        return mergeDataSources(amfiData, valResData);
    }

    function fetchNAVHistory(url) {
        return fetch(url)
            .then(response => response.text())
            .then(data => parseNAVData(data))
            .catch(error => {
                throw new Error('Error fetching AMFI NAV data.');
            });
    }

    function parseNAVData(data) {
        const lines = data.split('\n');
        const navData = { dates: [], values: [] };

        lines.forEach(line => {
            const fields = line.split(';');
            if (fields.length >= 8 && fields[4] && fields[7]) {
                const date = fields[7].trim();
                const value = parseFloat(fields[4].trim());
                if (!isNaN(value)) {
                    navData.dates.push(date);
                    navData.values.push(value);
                }
            }
        });

        return navData;
    }

    async function fetchValueResearchData(fundId, startDate, endDate) {
        try {
            const URL = `https://www.valueresearchonline.com/downloads/amfi-performance-xls/?source_url=%2Famfi%2Ffund-performance-data%2F%3Fend-type%3D1%26primary-category%3DSEQ%26category%3DSEQ_LC%26amc%3DALL%26nav-date%3D${formatDateForVR(endDate)}`;
            const response = await fetch(URL);
            const data = await response.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const fundData = jsonData.find(row => row[0] === fundId);
            if (!fundData) {
                throw new Error('Fund data not found');
            }

            return {
                name: fundData[1],
                dates: [formatDateForChart(fundData[3])],
                values: [parseFloat(fundData[5])],
                returns: {
                    '1Year': { direct: parseFloat(fundData[9]), benchmark: parseFloat(fundData[10]) },
                    '3Year': { direct: parseFloat(fundData[12]), benchmark: parseFloat(fundData[13]) },
                    '5Year': { direct: parseFloat(fundData[15]), benchmark: parseFloat(fundData[16]) },
                    '10Year': { direct: parseFloat(fundData[18]), benchmark: parseFloat(fundData[19]) },
                    'SinceLaunch': { direct: parseFloat(fundData[21]), benchmark: parseFloat(fundData[22]) }
                }
            };
        } catch (error) {
            console.error('Error fetching Value Research data:', error);
            return { name: '', dates: [], values: [], returns: {} };
        }
    }

    function mergeDataSources(data1, data2) {
        return {
            name: data2.name,
            dates: [...new Set([...data1.dates, ...data2.dates])].sort(),
            values: data1.values,
            returns: data2.returns
        };
    }

    function displayChart(allData) {
        if (window.navChart instanceof Chart) {
            window.navChart.destroy();
        }

        const datasets = allData.map((data, index) => ({
            label: data.name,
            data: data.values,
            borderColor: colors[index],
            borderWidth: 2,
            borderDash: styles[index],
            fill: false
        }));

        window.navChart = new Chart(navChartCtx, {
            type: 'line',
            data: { labels: allData[0].dates, datasets },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'day', displayFormats: { day: 'MMM d, yyyy' } },
                        title: { display: true, text: 'Date' }
                    },
                    y: { title: { display: true, text: 'NAV' } }
                }
            }
        });
    }

    function displayTable(allData) {
        const tableHTML = `
            <table id="fundTable">
                <thead>
                    <tr>
                        <th>Fund Name</th>
                        <th onclick="sortTable(1)">1 Year Return (%)</th>
                        <th onclick="sortTable(2)">3 Year Return (%)</th>
                        <th onclick="sortTable(3)">5 Year Return (%)</th>
                        <th onclick="sortTable(4)">10 Year Return (%)</th>
                        <th onclick="sortTable(5)">Since Launch Return (%)</th>
                    </tr>
                </thead>
                <tbody>
                    ${allData.map(data => `
                        <tr>
                            <td>${data.name}</td>
                            <td>${data.returns['1Year'].direct.toFixed(2)}</td>
                            <td>${data.returns['3Year'].direct.toFixed(2)}</td>
                            <td>${data.returns['5Year'].direct.toFixed(2)}</td>
                            <td>${data.returns['10Year'].direct.toFixed(2)}</td>
                            <td>${data.returns['SinceLaunch'].direct.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        dataTableDiv.innerHTML = tableHTML;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB').replace(/\//g, '-');
    }

    function formatDateForVR(dateString) {
        const date = new Date(dateString.split('-').reverse().join('-'));
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    }

    function formatDateForChart(dateString) {
        const [day, month, year] = dateString.split('-');
        return `${year}-${month}-${day}`;
    }

    window.sortTable = function(n) {
        const table = document.getElementById("fundTable");
        let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        switching = true;
        dir = "asc";
        while (switching) {
            switching = false;
            rows = table.rows;
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                if (dir == "asc") {
                    if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            } else {
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }
});