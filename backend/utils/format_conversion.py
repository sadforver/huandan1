import re


def hump2underline(hump_str):
    p = re.compile(r'([a-z]|\d)([A-Z])')
    sub = re.sub(p, r'\1_\2', hump_str).lower()
    return sub


def underline2hump(underline_str):
    sub = re.sub(r'(_\w)', lambda x: x.group(1)[1].upper(), underline_str)
    return sub


def underline_dict(params):
    new_params = params
    if isinstance(params, dict):
        new_params = {}
        for k, v in params.items():
            new_params[hump2underline(k)] = underline_dict(params[k])
    elif isinstance(params, list):
        new_params = []
        for param in params:
            new_params.append(underline_dict(param))
    print(new_params)
    return new_params


def camel_dict(params):
    new_params = params
    if isinstance(params, dict):
        new_params = {}
        for k, v in params.items():
            new_params[underline2hump(k)] = camel_dict(params[k])
    elif isinstance(params, list):
        new_params = []
        for param in params:
            new_params.append(camel_dict(param))
    print(new_params)
    return new_params