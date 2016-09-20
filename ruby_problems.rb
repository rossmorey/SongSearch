def substrings(str1, str2) {
  longest = ""

  start_idx = 0
  while start_idx < str1.length
    len = longest + 1
    while (start_idx + len) <= str1.length
      substring = str1.slice(start_idx, len)
      longest = substring if str2.include?(substring)
      len += 1
    end
    start_idx += 1
  end

  longest
}
