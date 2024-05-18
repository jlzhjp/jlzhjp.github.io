const CreativeCommons = () => {
  return (
    <p {...{ "xmlns:cc": "http://creativecommons.org/ns#" }}>
      <span>All content on this site is licensed under </span>
      <a
        href="https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1"
        target="_blank"
        rel="license noopener noreferrer"
        className="inline-flex items-center"
      >
        CC BY-NC 4.0
        <img
          style={{
            display: "inline",
            height: "22px!important",
            marginLeft: "3px",
            verticalAlign: "text-bottom",
          }}
          src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
          alt=""
        />
        <img
          style={{
            display: "inline",
            height: "22px!important",
            marginLeft: "3px",
            verticalAlign: "text-bottom",
          }}
          src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
          alt=""
        />
        <img
          style={{
            display: "inline",
            height: "22px!important",
            marginLeft: "3px",
            verticalAlign: "text-bottom",
          }}
          src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"
          alt=""
        />
      </a>
    </p>
  )
}

export default function Footer() {
  return (
    <footer className="px-4">
      <CreativeCommons />
    </footer>
  )
}
