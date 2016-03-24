var saved_data = {}

chrome.storage.onChanged.addListener(function(){
    get_storage();
})

document.addEventListener('DOMContentLoaded', function() {
    $(document).click(function(){
        if (window.location.hash.startsWith("#Instances"))
            get_storage();
    })
});

// I really want something like this!
// http://stackoverflow.com/a/3597640/517606


function get_storage() {
    chrome.storage.sync.get(default_data, function(items){
        saved_data = items
        // go();
        window.setTimeout(function(){
            go();    
        }, 400);    
    })
}

function go() {
    private_dns = get_selector(4,0);
    private_ip = get_selector(5,0);

    public_dns = get_selector(1,1);
    public_ip = get_selector(2,1);

    elastic_ip = get_selector(3,1);

    top_row = $("div.GMB span:eq(2)")


    add_to_field(private_ip)
    add_to_field(public_ip)
    add_to_field(elastic_ip)

    add_to_field(private_dns)
    add_to_field(public_dns)
    add_to_field(top_row)
}

function add_to_field(fld) {
    field_text = (fld.text().indexOf(':') > -1)
        // grab last item via reverse->first item
        ? fld.text().split(" ").reverse()[0] 
        : fld.text()

    if (field_text.indexOf("-") == 0 || field_text.trim().length == 0)
        return

    span = ($("span.awssshrdplink", fld).length)
            ? $("span.awssshrdplink", fld).empty()
            : $("<span />", {class: "awssshrdplink"})
    
    platform = get_selector(8,1).text();

    str_to_add = (platform == "windows")
                ? create_rdp(field_text) 
                : create_ssh(field_text);

    span.append(str_to_add)
    fld.append(span)
}

function create_ssh(host) {
    user = get_ssh_user();
    href = $("<a />", {href: "ssh://"+user+host , text: "SSH"})
    return href
}

function create_rdp(host) {
    user = get_windows_user();
    href = $("<a />", {href: "rdp://"+user+host , text: "RDP"})
    return href
}

function get_ssh_user() {
    default_user = saved_data['ssh_user']

    ami = get_selector(7,1).text();
    if (ami.indexOf("ubuntu") > -1) 
        user = "ubuntu"
    else if (ami.indexOf("amzn") > -1)
        user = "ec2-user"
    else if (ami.indexOf("RHEL") > -1)
        user = "ec2-user"
    else if (ami.indexOf("suse-sles") > -1)
        user = "ec2-user"
    else 
        user = default_user

    if (saved_data['always_override_user'])
        user = default_user

    return user + "@"
}

function get_windows_user() {
    return saved_data['rdp_user'] + "@"
}

function get_selector(row,div) {
    return $("table.LJ > tbody tr:eq("+row+") div.NJ:eq("+div+")")
}