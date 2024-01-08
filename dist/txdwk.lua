-- 腾讯大王卡动态免流
-- @author gsonhub
-- @date 2024-01-08 


local http = require 'http'
local backend = require 'backend'

local char = string.char
local byte = string.byte
local find = string.find
local sub = string.sub

local ADDRESS = backend.ADDRESS
local PROXY = backend.PROXY
local DIRECT_WRITE = backend.SUPPORT.DIRECT_WRITE

local SUCCESS = backend.RESULT.SUCCESS
local HANDSHAKE = backend.RESULT.HANDSHAKE
local DIRECT = backend.RESULT.DIRECT

local ctx_uuid = backend.get_uuid
local ctx_proxy_type = backend.get_proxy_type
local ctx_address_type = backend.get_address_type
local ctx_address_host = backend.get_address_host
local ctx_address_bytes = backend.get_address_bytes
local ctx_address_port = backend.get_address_port
local ctx_write = backend.write
local ctx_free = backend.free
local ctx_debug = backend.debug

local flags = {}
local kHttpHeaderSent = 1
local kHttpHeaderRecived = 2

local GUID = 'NULL'
local TOKEN = 'NULL'

function wa_lua_on_flags_cb(ctx)
    return DIRECT_WRITE
end

function wa_lua_on_handshake_cb(ctx)
    ctx_debug('wa_lua_on_handshake_cb')
    local uuid = ctx_uuid(ctx)
    local host = ctx_address_host(ctx)
    local port = ctx_address_port(ctx)

    if(find(host,'iikira.com.token')) then
        GUID,TOKEN = host:match("(%w+)%.(%w+)%.(%w+)")
        ctx_debug('GUID:'..GUID)
        ctx_debug('TOKEN:'..TOKEN)
    end   

    if flags[uuid] == kHttpHeaderRecived then
        return true
    end

    if flags[uuid] ~= kHttpHeaderSent then
        local res = 'CONNECT ' .. host .. ':' .. port .. '@wx.qlogo.cn HTTP/1.1\r\n' ..
                    'Host: ' .. 'wx.qlogo.cn' .. ':' .. port .. '\r\n' ..
                    'Q-GUID: '..GUID..'\r\n' ..
                    'Q-Token: '..TOKEN..'\r\n' ..
                    'Proxy-Connection: Keep-Alive\r\n\r\n'
        ctx_write(ctx, res)
        -- ctx_debug('wa_lua_on_handshake_cb res '..res)
        flags[uuid] = kHttpHeaderSent
    end

    return false
end

function wa_lua_on_read_cb(ctx, buf)
    ctx_debug('wa_lua_on_read_cb')
    local uuid = ctx_uuid(ctx)
    if flags[uuid] == kHttpHeaderSent then
        flags[uuid] = kHttpHeaderRecived
        return HANDSHAKE, nil
    end
    return DIRECT, buf
end

function wa_lua_on_write_cb(ctx, buf)
    ctx_debug('wa_lua_on_write_cb') 
    return DIRECT, buf
end

function wa_lua_on_close_cb(ctx)
    ctx_debug('wa_lua_on_close_cb')
    local uuid = ctx_uuid(ctx)
    flags[uuid] = nil
    ctx_free(ctx)
    return SUCCESS
end
