const psl = require('psl');

let findWhitelistRule = (rules: any, host: string, url: string): any => {
  for (var i = 0; i < rules.length; i++) {
    for (var j = 0; j < rules[i].domains.length; j++) {
      if (host.includes(rules[i].domains[j].domain)) {
        if (rules[i].domains[j].re) {
          if (!new RegExp(rules[i].domains[j].pattern).test(url)) {
            return null;
          }
        }

        return {
          id: rules[i].id,
          idx: j,
          profile: rules[i].profile,
        };
      }
    }
  }

  return null;
};

let ipConverter = (ip: any): number | string => {
  if (ip['type'] === 'full') {
    return (
      ip.data.split('.').reduce(function(ipInt: number, octet: string) {
        return (ipInt << 8) + parseInt(octet, 10);
      }, 0) >>> 0
    );
  }

  return (ip.num >>> 24) + '.' + ((ip.num >> 16) & 255) + '.' + ((ip.num >> 8) & 255) + '.' + (ip.num & 255);
};

let parseURL = (url: string): any => {
  let u = new URL(url);
  let uParsed = psl.parse(u.hostname);

  return {
    base: u.hostname
      .split('.')
      .splice(-2)
      .join('.'),
    domain: uParsed.domain,
    hostname: u.hostname,
    origin: u.origin,
    pathname: u.pathname,
  };
};

let validateIPRange = (from: string, to: string): boolean => {
  return ipConverter({ data: from, type: 'full' }) <= ipConverter({ data: to, type: 'full' });
};

export default {
  findWhitelistRule,
  ipConverter,
  parseURL,
  validateIPRange,
};